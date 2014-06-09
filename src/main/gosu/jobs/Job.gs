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

abstract class Job implements Runnable {

  static final var MAX_PROGRESS_VALUE = 100
  static var dataStore = new DataSet('jobs')
  var id : Map<Object, Object>
  var jobInfo : Map<Object, Object>

  construct(data : Map<Object, Object>) {
    if (data == null) {return}
    id = new HashMap<Object,Object>()
    id['UUId'] = data['UUId']
    this.jobInfo = data
  }

  construct() {
    jobInfo = new HashMap<Object, Object>()
    id = new HashMap<Object, Object>()
    this.UUId = UUID.randomUUID().toString()
    this.Progress = 0
    this.Type = this.IntrinsicType.Name
  }

  function start() {
    var config = new ConfigBuilder().build()
    var args = {jobInfo}
    var testJob = new Job(this.IntrinsicType.Name,args)
    var client = new ClientImpl(config)
    client.enqueue('main', testJob)
    client.end()
  }

  property get Type() : String {
    return (jobInfo['Type'] as String)
  }

  property set Type(type : String) {
    jobInfo['Type'] = type
    dataStore.update(id,jobInfo)
  }

  property get StartTime() : Long {
    return (jobInfo['StartTime'] as Long)
  }

  property set StartTime(time : Long) {
    jobInfo['StartTime'] = time
    dataStore.update(id,jobInfo)
  }

  property get EndTime() : Long {
    var time = jobInfo['EndTime'] as Long
    return time
  }

  property set EndTime(time : Long) {
    jobInfo['EndTime'] = time
    dataStore.update(id,jobInfo)
  }

  property get UUId() : String {
    return id['UUId'] as String
  }

  property set UUId(newUUId : String) {
    jobInfo['UUId'] = newUUId
    id['UUId'] = newUUId
    dataStore.save(id)
  }

  property get Progress() : int {
    return dataStore.findOne(id)['Progress'] as Integer
  }

  static function getUUIDProgress(UUID : String) : Long {
    return dataStore.findOne({'UUId' -> UUID})['Progress'] as Long
  }

  property set Progress(progress : int) {
    jobInfo['Progress'] = progress
    dataStore.update(id, jobInfo)
    checkBounds()
  }

  static function cancel(UUID : String) {
    for (job in ActiveJobs) {
      if (job.UUId.toString() == UUID) {
        job.Cancelled = true
        break
      }
    }
  }

  property set Cancelled(status : boolean) {
    EndTime = System.nanoTime()
    jobInfo = dataStore.findOne(id)
    jobInfo['Cancelled'] = status
    dataStore.update(id, jobInfo)
  }

  property get Cancelled() : boolean {
    if (Thread.currentThread().isInterrupted()) {
      this.Cancelled = true
      return true
    }
    return dataStore.findOne(id)['Cancelled'] as Boolean ?: false
  }

  property get ElapsedTime() : String {
    return (((this.EndTime ?: System.nanoTime()) - this.StartTime) / 1000000000) as String + " Seconds"
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
    jobInfo['State'] = state
    dataStore.update(id, jobInfo)
  }

  static function newUp(job : Map<Object, Object>) : jobs.Job {
    if (job == null) {
      return null
    } else if (job['Type'] as String == 'jobs.TestJob') {
      return new TestJob(job)
    } else if (job['Type'] as String == 'jobs.GenerateJob') {
      return new GenerateJob(job)
    }
    return new TestJob(job)
  }

  /*
  * Depending on how bloated the jobs collection gets, we might consider adding a field that
  * indicates an active job so that this O(n) filtering doesn't have to happen
   */
  static property get ActiveJobs() : List<jobs.Job> {
    var jobs = dataStore.find()
    for (job in jobs.copy()) {
      if ((job.get('Progress') as Integer) == MAX_PROGRESS_VALUE
           || (job.get('Cancelled') as Boolean) == true) {
        jobs.remove(job)
      }
    }
    return jobs.map(\ j -> newUp(j))
  }

  static property get CompleteJobs() : List<jobs.Job> {
    return dataStore.find({'Progress' -> MAX_PROGRESS_VALUE}).map(\ j -> newUp(j))
  }

  static property get CancelledJobs() : List<jobs.Job> {
    return dataStore.find({"Cancelled" -> true}).map(\ j -> newUp(j))
  }

  static function renderToString(uuid : String) : String {
    return JobDrillDown.renderToString(newUp(dataStore.findOne({'UUId' -> uuid})))
  }

  abstract function renderToString() : String

}