package controller

uses sparkgs.util.IHasRequestContext
uses jobs.TestJob
uses datagen.Generator

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    new TestJob().start()
    return "Job Started!!!"
  }
  static function startGenerateJob() : String{
    Generator.generate()
    return "Job Started!!!"
  }
}