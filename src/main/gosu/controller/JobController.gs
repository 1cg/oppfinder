package controller

uses sparkgs.util.IHasRequestContext
uses jobs.TestJob
uses jobs.GenerateJob
uses datagen.Generator
uses java.util.UUID
uses jobs.Job

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
  static function cancelJob(id : UUID) : String{
    for (job in Job.Active) {
      if (job.UUId == id) {

        break
      }
    }
    return "Job Cancelled"
  }
}