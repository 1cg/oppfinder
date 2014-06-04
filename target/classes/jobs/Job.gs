package jobs

uses net.greghaines.jesque.client.ClientImpl
uses net.greghaines.jesque.ConfigBuilder
uses net.greghaines.jesque.Job
uses model.DataSet
uses java.util.Map
uses java.lang.Runnable
uses model.Database
uses java.util.HashMap
uses java.util.UUID
uses java.lang.System

abstract class Job implements Runnable {

  var dataStore : DataSet
  var jobInfo : Map<String, Object>
  protected var progress : float

  function start() {
    var config = new ConfigBuilder().build()
    var testJob = new Job(this.IntrinsicType.Name,{})
    var client = new ClientImpl(config)
    client.enqueue("main", testJob)
    client.end()
    dataStore = new DataSet("jobs")
    jobInfo = new HashMap<String, Object>()
    jobInfo.put("JobID", UUID.randomUUID())
    dataStore.save(jobInfo)
    pushStatus()
  }

  function pushStatus() {
    var update = new HashMap<String, Object>()
    if (progress == 0.0) {
      update.put("StartTime", System.nanoTime())
    } else if (progress == 1.0) {
      update.put("EndTime", System.nanoTime())
    }
    update.put("Progress", progress)
    dataStore.update(jobInfo, update)
  }

  function displayState(state : String) {

  }
}