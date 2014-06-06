package controller

uses sparkgs.util.IHasRequestContext
uses jobs.TestJob
uses jobs.GenerateJob

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    new TestJob().start()
    return "Job Started!!!"
  }
  static function startGenerateJob() : String{
//    Generator.generate()
    new GenerateJob().start()
    return "Click Display Data to view company information."
  }

}