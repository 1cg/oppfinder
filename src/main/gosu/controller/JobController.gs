package controller

uses sparkgs.util.IHasRequestContext
uses net.greghaines.jesque.*
uses net.greghaines.jesque.client.*

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    var config = new ConfigBuilder().build()
    var testJob = new Job("TestJob",{})
    var client = new ClientImpl(config)
    client.enqueue("main", testJob)
    client.end()
    return "Job Started!!!"
  }

}