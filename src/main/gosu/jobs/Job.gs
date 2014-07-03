package jobs

uses net.greghaines.jesque.client.ClientImpl
uses net.greghaines.jesque.Job
uses model.MongoCollection
uses java.util.Map
uses java.lang.Runnable
uses java.util.HashMap
uses java.util.UUID
uses java.lang.System
uses java.lang.Integer
uses java.lang.Long
uses java.lang.Thread
uses util.TransformIterable
uses util.SkipIterable
uses java.lang.Class
uses java.lang.Exception
uses util.CancellationException
uses util.NoSuchUUIDException
uses util.RedisConfigUtil

abstract class Job implements Runnable {

  static final var COLLECTION = 'jobs'
  protected static final var MAX_PROGRESS_VALUE : int = 100
  static var dataStore = new MongoCollection (COLLECTION)
  var id : Map<Object, Object>

  construct(data : Map<Object, Object>) {
    if (data == null) throw new NoSuchUUIDException()
    else if (dataStore.findOne({'UUId' -> data['UUId']}) == null) throw new NoSuchUUIDException()
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
    EndTime = System.currentTimeMillis()
    e.printStackTrace()
  }

  abstract function executeJob()

  final function start() : jobs.Job {
    RedisConfigUtil.INSTANCE.enqueue('main',new Job(this.IntrinsicType.Name,{dataStore.findOne(id)}))
    return this
  }

  function join() {
    while(this.Progress < 100) {
      Thread.sleep(100)
    }
  }

  abstract function doReset()

  final function reset() {
    UUId = UUID.randomUUID().toString()
    update({'StatusFeed' -> null})
    Status = 'Active'
    Progress = 0
    doReset()
    EndTime = null
    start()
  }

  function delete() {
    dataStore.remove(dataStore.findOne({'UUId' -> UUId}))
  }

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

  property get Failed() : boolean {
    return Status == "Failed"
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

  property get StatusFeed() : String {
    return dataStore.findOne(id)?.get('StatusFeed') as String ?: ""
  }

  property set StatusFeed(feedUpdate : String) {
    dataStore.update(id, {'StatusFeed' -> this.StatusFeed+feedUpdate+"\n"})
  }

  property set FieldName(field: String) {
    dataStore.update(id, {'Field' -> field})
  }

  property get FieldName() : String {
    return dataStore.findOne(id)?.get('Field') as String
  }

  function cancel() {
    Cancelled = true
  }

  static function find(UUID : String) : jobs.Job {
    return newUp(UUID, null)
  }

  static function findByStatus(status : String) : SkipIterable<jobs.Job> {
    if (status == 'all') {
      return AllJobs
    } else if (status == 'failed') {
      return FailedJobs
    } else if (status == 'cancelled') {
      return CancelledJobs
    } else if (status == 'running') {
      return ActiveJobs
    } else if (status == 'completed') {
      return CompleteJobs
    }
    throw "Unsupported state for jobs: ${status}"
  }

  property set Cancelled(status : boolean) {
    EndTime = System.currentTimeMillis()
    if (status) {
      dataStore.update(id, {'Status' -> 'Cancelled'})
    } else {
      dataStore.update(id, {'Status' -> 'Reset'})
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

  private function calculateElapsedTime(start : Long, end : Long) : String {
    if (start == null) return "0 Seconds"
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
  static function newUp(UUID : String, type : String) : jobs.Job {
    if (UUID == null) return null
    else if (type == null) {
      type = dataStore.findOne({'UUId' -> UUID})?['Type'] as String
      if (type == null) return null
    }
    return Class.forName(type)
                      .getConstructor({Map.Type.IntrinsicClass})
                      .newInstance({{'Type' -> type, 'UUId' -> UUID}}) as jobs.Job
  }

  static property get ActiveJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.find({'Status' -> 'Active'}).Cursor, \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  static property get CompleteJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.find({'Status' -> 'Complete'}).Cursor, \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  static property get CancelledJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.find({'Status' -> 'Cancelled'}).Cursor, \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  static property get FailedJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.find({'Status' -> 'Failed'}).Cursor, \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  static property get AllJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.queryNot('Status', 'Subjob').Cursor, \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  // This is for Salesforce uploading
  static property get CompleteRecommendJobs() : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.find({'Status' -> 'Complete', 'Type' -> 'jobs.RecommendJob'}).Cursor,
            \ m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  static function findByIDs(IDs : List<String>) : SkipIterable<jobs.Job> {
    return new TransformIterable<jobs.Job>(
        dataStore.queryOr(IDs, 'UUId').Cursor, \
            m -> newUp((m as Map)['UUId'] as String, (m as Map)['Type'] as String))
  }

  abstract function renderToString() : String

}