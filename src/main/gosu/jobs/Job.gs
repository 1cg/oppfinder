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
uses java.util.Iterator
uses view.JobDrillDown
uses model.TransformationIterator

abstract class Job implements Runnable {

  static final var MAX_PROGRESS_VALUE = 100
  static var dataStore = new DataSet('jobs')
  var id : Map<Object, Object>

  construct(data : Map<Object, Object>) {
    if (data == null) {return}
    id = new HashMap<Object,Object>()
    id['UUId'] = data['UUId']
  }

  construct() {
    id = new HashMap<Object, Object>()
    this.UUId = UUID.randomUUID().toString()
    this.Progress = 0
    this.Type = this.IntrinsicType.Name
  }

  function start() {
    var config = new ConfigBuilder().build()
    var testJob = new Job(this.IntrinsicType.Name,{dataStore.findOne(id)})
    var client = new ClientImpl(config)
    client.enqueue('main', testJob)
    client.end()
  }

  static function reset(UUID : String) {
    var job = newUp(dataStore.findOne({'UUId' -> UUID}))
    job.Cancelled = false
    job.Progress = 0
    job.EndTime = null
    job.reset()
    job.start()
  }

  abstract function reset()

  property get Type() : String {
    return (this.IntrinsicType.Name)
  }

  property set Type(type : String) {
    dataStore.update(id,{'Type' -> type})
  }

  property get StartTime() : Long {
    return dataStore.findOne(id)['StartTime'] as Long
  }

  property set StartTime(time : Long) {
    dataStore.update(id,{'StartTime' -> time})
  }

  property get EndTime() : Long {
    return dataStore.findOne(id)['EndTime'] as Long
  }

  property set EndTime(time : Long) {
    dataStore.update(id,{'EndTime' -> time})
  }

  property get UUId() : String {
    return id['UUId'] as String
  }

  property set UUId(newUUId : String) {
    id['UUId'] = newUUId
    dataStore.save(id)
  }

  property get Progress() : int {
    return dataStore.findOne(id)?.get('Progress') as Integer ?: 0
  }

  property set Progress(progress : int) {
    dataStore.update(id, {'Progress' -> progress})
    checkBounds()
  }

  static function getUUIDProgress(UUID : String) : Long {
    return dataStore.findOne({'UUId' -> UUID})['Progress'] as Long
  }

  static function cancel(UUID : String) {
    newUp(dataStore.findOne({'UUId' -> UUID})).Cancelled = true
  }

  property set Cancelled(status : boolean) {
    EndTime = System.nanoTime()
    dataStore.update(id, {'Cancelled' -> status})
  }

  property get Cancelled() : boolean {
    if (Thread.currentThread().isInterrupted()) {
      this.Cancelled = true
      return true
    }
    return dataStore.findOne(id)['Cancelled'] as Boolean ?: false
  }

  property get ElapsedTime() : String {
    var totalSeconds = (((this.EndTime ?: System.nanoTime()) - this.StartTime) / 1000000000)
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
  function checkBounds() {
    if (this.Progress == 0) {
      this.StartTime =  System.nanoTime()
    } else if (this.Progress == MAX_PROGRESS_VALUE) {
      this.EndTime = System.nanoTime()
    }
  }

  function displayState(state : String) {
    dataStore.update(id, {'State' -> state})
  }

  static function newUp(job : Map<Object, Object>) : jobs.Job {
    if (job == null) {
      return null
    } else if (job['Type'] as String == 'jobs.TestJob') {
      return new TestJob(job)
    } else if (job['Type'] as String == 'jobs.GenerateJob') {
      return new GenerateJob(job)
    } else if (job['Type'] as String == 'jobs.UploadJob') {
      return new UploadJob(job)
    }
    return new TestJob(job)
  }

  /*
  * Depending on how bloated the jobs collection gets, we might consider adding a field that
  * indicates an active job so that this O(n) filtering doesn't have to happen
   */
  static property get ActiveJobs() : Iterator<jobs.Job> {
    var active = new java.util.ArrayList<jobs.Job>()
    for (job in dataStore.find()) {
      if (((job.get('Progress') as Integer) < MAX_PROGRESS_VALUE)
           && ((job.get('Cancelled') as Boolean) ?: false) == false) {
        active.add(newUp(job))
      }
    }
    return active.iterator()
  }

  static property get CompleteJobs() : Iterator<jobs.Job> {
    return new TransformationIterator<Map<Object,Object>,jobs.Job>(
        dataStore.find({'Progress' -> MAX_PROGRESS_VALUE}), \ m -> newUp(m))
  }

  static property get CancelledJobs() : Iterator<jobs.Job> {
    return new TransformationIterator<Map<Object,Object>,jobs.Job>(
        dataStore.find({"Cancelled" -> true}), \ m -> newUp(m))
  }

  static function renderToString(uuid : String) : String {
    return JobDrillDown.renderToString(newUp(dataStore.findOne({'UUId' -> uuid})))
  }

  abstract function renderToString() : String

}