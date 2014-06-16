package controller

uses sparkgs.util.IHasRequestContext
uses jobs.TestJob
uses jobs.GenerateJob
uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses datagen.GenerateRandom

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    new TestJob().start()
    return "Job Started!!!"
  }
  static function startGenerateJob() : String {
    new GenerateRandom().generateRandom('datagen/assets/data.json')
    new GenerateJob('datagen/assets/data.json').start()
    return "Company information listed below."
  }
  static function cancelJob(UUID : String) : String{
    Job.cancel(UUID)
    return "Job Cancelled"
  }

  static function resetJob(UUID : String) : String{
    Job.reset(UUID)
    return "Job Reset"
  }

  static function startUploadJob(requestBody : String) : String {
    new UploadJob(requestBody).start()
    return view.Companies.renderToString(1)
  }

  static function startRecommendJob() : String {
    new RecommendJob().start()
    return "Recommend Job Started"
  }

}