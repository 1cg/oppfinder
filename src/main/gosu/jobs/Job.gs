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
uses java.util.ArrayList

abstract class Job implements Runnable {

  static var dataStore : DataSet = new DataSet('jobs')
  var jobInfo : Map<String, Object>

  construct() {
    jobInfo = new HashMap<String, Object>()
    this.JobId = UUID.randomUUID().toString()
    this.Progress = 0
  }

  function start() {
    var config = new ConfigBuilder().build()
    var testJob = new Job(this.IntrinsicType.Name,{})
    var client = new ClientImpl(config)
    client.enqueue("main", testJob)
    client.end()
  }

  property get JobId() : String {
    return jobInfo.get('UUID') as String
  }

  property set JobId(id : String) {
    jobInfo.put("UUID", id)
    dataStore.insert(jobInfo)
  }

  property get Progress() : int {
    return dataStore.find(jobInfo).get(0).get('Progress') as Integer
  }

  property set Progress(progress : int) {
    var update = new HashMap<String, Object>()
    checkBounds()
    update.put("Progress", progress)
    dataStore.update(jobInfo, update)
  }

  /*
  * If we are either at the start or the end of the job, log the status
   */
  function checkBounds() {
    var update = new HashMap<String, Object>()
    if (this.Progress == 0) {
      update.put("StartTime", System.nanoTime())
    } else if (this.Progress == 100) {
      update.put("EndTime", System.nanoTime())
    }
  }

  function displayState(state : String) {
    var update = new HashMap<String, String>()
    update.put("State", state)
    dataStore.update(jobInfo, update)
  }

  //Extremely inefficient
  static function getActiveJobs() : List<JobInfo> {
    var jobs = dataStore.find()
    for (job in jobs.copy()) {
      print(job)
      if (job.get('Progress') as Integer == 100) {
        jobs.remove(job)
      }
    }
    print(jobs.size())
    return jobs.map(\ j -> new JobInfo(j.get('UUID') as String,j.get('Progress') as Integer))
  }

}