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
    new GenerateRandom().generateRandom('data.json')
    new GenerateJob('data.json').start()
    return "Company information listed below."
  }
  static function startGenerateTestJob(testVar : String) : String {
    new GenerateTest().generateTest('dataReach.json', testVar, 40000)
    new GenerateJob('dataReach.json').start()
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

  static function deleteJob(UUID : String) : String{
    Job.delete(UUID)
    return "Delete"
  }

  static function getUUIDProgress(UUID : String) : String {
    return Job.getUUIDProgress(UUID)
  }

  static function getUUIDElapsedTime(UUID : String) : String {
    return Job.getUUIDElapsedTime(UUID)
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