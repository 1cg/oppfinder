package controller

uses sparkgs.util.IHasRequestContext

uses jobs.GenerateJob
uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses datagen.GenerateRandom
uses datagen.GenerateTest
uses gw.lang.reflect.ReflectUtil

class JobController implements IHasRequestContext {

  static function startTestJob() : String{
    var testJob = ReflectUtil.construct<Job>("TestJob", {})
    testJob.start()
    return "Job Started!!!"
  }
  static function startGenerateJob() : String {
    new GenerateRandom().generateRandom('src/main/gosu/datagen/assets/data.json')
    new GenerateJob('src/main/gosu/datagen/assets/data.json').start()
    return "Company information listed below."
  }
  static function startGenerateTestJob(testVar : String) : String {
    new GenerateTest().generateTest('src/main/gosu/datagen/assets/dataReach.json', testVar)
    new GenerateJob('src/main/gosu/datagen/assets/dataReach.json').start()
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