package jobs

uses net.greghaines.jesque.client.ClientImpl
uses net.greghaines.jesque.ConfigBuilder
uses net.greghaines.jesque.Job
uses model.DataSet
uses java.util.Map
uses java.lang.Runnable
uses java.util.HashMap
uses java.util.UUID
uses java.lang.System
uses java.lang.Integer
uses java.lang.Long
uses java.lang.Thread
uses view.JobDrillDown
uses util.TransformationIterator
uses util.SkipIterator
uses java.lang.Class
uses java.lang.Exception
uses util.CancellationException

abstract class Job implements Runnable {

  static final var COLLECTION = 'jobs'
  protected static final var MAX_PROGRESS_VALUE : int = 100
  static var dataStore = new DataSet(COLLECTION)
  var id : Map<Object, Object>

  construct(data : Map<Object, Object>) {
    if (data == null) return
    id = new HashMap<Object,Object>()
    id['UUId'] = data['UUId']
  }

  construct() {
    id = new HashMap<Object, Object>()
    this.UUId = UUID.randomUUID().toString()
    this.Progress = 0
    this.Type = this.IntrinsicType.Name
  }

  override final function run() {
    try {
      executeJob()
      this.Progress = 100
    } catch(ce : CancellationException) {
      //Do nothing
    } catch(e : Exception) {
      handleErrorState(e)
    }
  }

  function checkCancellation() {
    if (Cancelled) throw new CancellationException()
  }

  function handleErrorState(e : Exception) {
    update({'Exception' -> e.StackTraceAsString})
    Status = 'Failed'
    e.printStackTrace()
  }

  abstract function executeJob()

  final function start() : jobs.Job {
    var builder = new ConfigBuilder()
    var host = System.Env['REDIS_HOST']
    if (host != null) {
      builder.withHost(host)
    }
    var config = builder.build()
    var testJob = new Job(this.IntrinsicType.Name,{dataStore.findOne(id)})
    var client = new ClientImpl(config)
    client.enqueue('main', testJob)
    client.end()
    return this
  }

  function join() {
    while(this.Progress < 100) {
      Thread.sleep(100)
    }
  }

  static function reset(UUID : String) {
    var job = newUp(dataStore.findOne({'UUId' -> UUID}))
    job.Cancelled = false
    job.Progress = 0
    job.EndTime = null
    job.reset()
    job.start()
  }

  static function delete(UUId : String) {
    dataStore.remove(dataStore.findOne({'UUId' -> UUId}))
  }

  abstract function reset()

  final function update(update : Map<Object,Object>) {
    dataStore.update(id, update)
  }

  function search(field : String) : Object {
    return dataStore.findOne(id)?[field]
  }

  property get Type() : String {
    return (this.IntrinsicType.Name)
  }

  property set Type(type : String) {
    dataStore.update(id,{'Type' -> type})
  }

  property get StartTime() : Long {
    return dataStore.findOne(id)?['StartTime'] as Long
  }

  property set StartTime(time : Long) {
    dataStore.update(id,{'StartTime' -> time})
  }

  property get EndTime() : Long {
    return dataStore.findOne(id)?['EndTime'] as Long
  }

  property set EndTime(time : Long) {
    dataStore.update(id,{'EndTime' -> time})
  }

  property get UUId() : String {
    return id?['UUId'] as String
  }

  property set UUId(newUUId : String) {
    id?['UUId'] = newUUId
    dataStore.save(id)
  }

  property get Progress() : int {
    return dataStore.findOne(id)?.get('Progress') as Integer ?: 0
  }

  property set Progress(progress : int) {
    if (progress == MAX_PROGRESS_VALUE) {
      this.Status = 'Complete'
    }
    dataStore.update(id, {'Progress' -> progress})
    checkBounds(progress)
  }

  property set FieldName(field: String) {
    dataStore.update(id, {'Field' -> field})
  }

  property get FieldName() : String {
    return dataStore.findOne(id)?.get('Field') as String
  }

  static function getUUIDProgress(UUID : String) : String {
    var job = dataStore.findOne({'UUId' -> UUID})
    return job == null ? null : (job['Progress'] as String) + "%"
  }

  static function getUUIDElapsedTime(UUID : String) : String {
    var start = dataStore.findOne({'UUId' -> UUID})['StartTime'] as Long
    var end = dataStore.findOne({'UUId' -> UUID})['EndTime'] as Long
    return calculateElapsedTime(start, end)
  }

  static function cancel(UUID : String) {
    newUp(dataStore.findOne({'UUId' -> UUID})).Cancelled = true
  }

  property set Cancelled(status : boolean) {
    EndTime = System.currentTimeMillis()
    if (status) {
      dataStore.update(id, {'Status' -> 'Cancelled'})
    }
  }

  property get Cancelled() : boolean {
    if (Thread.currentThread().isInterrupted()) {
      this.Cancelled = true
      return true
    }
    return (dataStore.findOne(id)?['Status'] as String == 'Cancelled')
  }

  property get Status() : String {
    return dataStore.findOne(id)?.get('Status') as String
  }

  property set Status(status : String) {
    dataStore.update(id, {'Status' -> status})
  }

  property get ElapsedTime() : String {
    return calculateElapsedTime(this.StartTime, this.EndTime)
  }

  private static function calculateElapsedTime(start : Long, end : Long) : String {
    var totalSeconds = (((end ?: System.currentTimeMillis()) - start) / 1000)
    var returnString = ""
    if (totalSeconds > 3600) {
      var hours = totalSeconds / 3600
      returnString += hours + " Hours "
      totalSeconds -= hours*3600
    }
    if (totalSeconds > 60) {
      var minutes = totalSeconds / 60
      returnString += minutes + " Minutes "
      totalSeconds -= minutes*60
    }
    return returnString + totalSeconds + " Seconds"
  }

  /*
  * If we are either at the start or the end of the job, log the status
   */
  private function checkBounds(progress : int) {
    if (progress == 0) {
      this.StartTime =  System.currentTimeMillis()
      this.Status = 'Active'
    } else if (progress == MAX_PROGRESS_VALUE) {
      this.Status = 'Complete'
      this.EndTime = System.currentTimeMillis()
    }
  }

  function displayState(state : String) {
    dataStore.update(id, {'State' -> state})
  }

  /*
  * Instantiates an object through the provided class name
  */
  static function newUp(job : Map<Object, Object>) : jobs.Job {
    if (job == null) return null
    return Class.forName(job['Type'] as String)
                      .getConstructor({Map.Type.IntrinsicClass})
                      .newInstance({job}) as jobs.Job
  }

  static property get ActiveJobs() : SkipIterator<jobs.Job> {
    return new TransformationIterator<jobs.Job>(
        dataStore.find({'Status' -> 'Active'}), \ m -> newUp(m))
  }

  static property get CompleteJobs() : SkipIterator<jobs.Job> {
    return new TransformationIterator<jobs.Job>(
        dataStore.find({'Status' -> 'Complete'}), \ m -> newUp(m))
  }

  static property get CancelledJobs() : SkipIterator<jobs.Job> {
    return new TransformationIterator<jobs.Job>(
        dataStore.find({'Status' -> 'Cancelled'}), \ m -> newUp(m))
  }

  static function renderToString(uuid : String) : String {
    return JobDrillDown.renderToString(newUp(dataStore.findOne({'UUId' -> uuid})))
  }

  abstract function renderToString() : String

}