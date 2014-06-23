package controller

uses sparkgs.util.IHasRequestContext

uses jobs.GenerateJob
uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses datagen.GenerateRandom
uses datagen.GenerateTest
uses gw.lang.reflect.ReflectUtil
uses view.JobDrillDown
uses model.DataSetEntry

class JobController implements IHasRequestContext {

  static var UUId : String

  static function startTestJob() : String{
    var testJob = ReflectUtil.construct<Job>("TestJob", {})
    testJob.start()
    return "Job Started!!!"
  }

  static function startGenerateJob(collection : String) : String {
    new GenerateRandom().generateRandom('data.json')
    var job = new GenerateJob('data.json', collection).start()
    UUId = job.UUId
    return "Company information listed below."
  }

  static function startGenerateTestJob(testVar : String, collection : String) : String {
    new GenerateTest().generateTest('dataReach.json', testVar, 40000)
    var job = new GenerateJob('dataReach.json', collection).start()
    UUId = job.UUId
    return "Company information listed below."
  }

  static property get LocalGenerateProgress() : String {
    return Job.getUUIDProgress(UUId)
  }

  static property get LocalGenerateComplete() : String {
    if (Job.getUUIDProgress(UUId) == "100%") {
      return '<div class="fa fa-check green navbar-left" style="padding-left:10px;padding-top:4px;"</div>'
    } else {
      return '<div></div>'
    }
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

  static function startRecommendJob(collection : String) : String {
    new RecommendJob(collection).start()
    return "Recommend Job Started"
  }

  static function renderJobInfo(UUID: String) : String {
    var job = Job.newUp(UUID,null)
    if (job == null) return "Oops, this appears to be an invalid UUID"
    var response = JobDrillDown.renderToString(job)
    if (job.Failed) return ""
    return response
  }

  static function selectCollection(requestBody : String) : String {
    var collection = requestBody.split("=")[1]
    DataSetEntry.CurrentCollection = collection
    return collection
  }

  static function getCurrentCollection() : String {
    return DataSetEntry.CurrentCollection
  }

}