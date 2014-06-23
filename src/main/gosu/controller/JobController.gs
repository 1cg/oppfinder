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
uses view.FailedJobView
uses view.JobStatusFeedList
uses model.DataSetEntry

class JobController implements IHasRequestContext {

  static var UUId : String

  static function startTestJob() {
    var testJob = ReflectUtil.construct<Job>("TestJob", {})
    testJob.start()
    return
  }

  static function startGenerateJob(collection : String) {
    new GenerateRandom().generateRandom('data.json')
    var job = new GenerateJob('data.json', collection).start()
    UUId = job.UUId
    return
  }

  static function startGenerateTestJob(testVar : String, collection : String) {
    new GenerateTest().generateTest('dataReach.json', testVar, 40000)
    var job = new GenerateJob('dataReach.json', collection).start()
    UUId = job.UUId
    return
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

  static function cancelJob(UUID : String) {
    Job.cancel(UUID)
    return
  }

  static function resetJob(UUID : String) {
    Job.reset(UUID)
    return
  }

  static function deleteJob(UUID : String) {
    Job.delete(UUID)
    return
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

  static function startRecommendJob(collection : String) {
    new RecommendJob(collection).start()
    return
  }

  static function getStatusFeed(UUID : String) : String {
    return JobStatusFeedList.renderToString(Job.newUp(UUID, null))
  }

  static function renderJobInfo(UUID : String) : String {
    var job = Job.newUp(UUID,null)
    var response = ""
    var failed = job.Failed
    if (job == null) return "Oops, this appears to be an invalid UUID"
    response += JobDrillDown.renderToString(job)
    if (failed) response += FailedJobView.renderToString(job)
    response += JobStatusFeedList.renderToString(job)
    if (!failed) response += job.renderToString()
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