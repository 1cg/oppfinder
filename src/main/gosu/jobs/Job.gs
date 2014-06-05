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

abstract class Job implements Runnable {

  static var dataStore = new DataSet('jobs')
  var id : Map<Object, Object>
  var jobInfo : Map<Object, Object>

  construct(data : Map<Object, Object> = null) {
    if (data != null) {
      id = new HashMap<Object,Object>()
      id['UUId'] = data['UUId']
      this.jobInfo = data
      return
    }
    jobInfo = new HashMap<Object, Object>()
    id = new HashMap<Object, Object>()
    this.UUId = UUID.randomUUID().toString()
    this.Progress = 0
    this.Type = this.IntrinsicType.Name
  }

  function start() {
    var config = new ConfigBuilder().build()
    var testJob = new Job(this.IntrinsicType.Name,{})
    var client = new ClientImpl(config)
    client.enqueue('main', testJob)
    client.end()
  }

  property set Type(type : String) {
    jobInfo['Type'] = type
    dataStore.update(id,jobInfo)
  }

  property get Type() : String {
    return (jobInfo['Type'] as String)
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
    return dataStore.find(id).get(0)['Progress'] as Integer
  }

  property set Progress(progress : int) {
    jobInfo['Progress'] = progress
    dataStore.update(id, jobInfo)
    checkBounds()
  }

  /*
  * If we are either at the start or the end of the job, log the status
   */
  function checkBounds() {
    if (this.Progress == 0) {
      jobInfo['StartTime'] =  System.nanoTime()
    } else if (this.Progress == 100) {
      jobInfo['EndTime'] = System.nanoTime()
    }
  }

  function displayState(state : String) {
    jobInfo['State'] = state
    dataStore.update(id, jobInfo)
  }

  static function newUp(job : Map<Object, Object>) : jobs.Job {
    if (job.get('Type') as String == 'TestJob') {
      return new TestJob(job)
    }
    return new TestJob(job)
  }

  static property get Active() : List<jobs.Job> {
    var jobs = dataStore.find()
    for (job in jobs.copy()) {
      if (job.get('Progress') as Integer >= 100) {
        jobs.remove(job)
      }
    }
    return jobs.map(\ j -> newUp(j))
  }

}