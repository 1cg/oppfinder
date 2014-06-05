package controller

uses sparkgs.util.IHasRequestContext
uses jobs.TestJob

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    new TestJob().start()
    return "Job Started!!!"
  }

}