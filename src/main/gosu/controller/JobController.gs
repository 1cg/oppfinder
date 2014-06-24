package controller

uses sparkgs.util.IHasRequestContext

uses jobs.GenerateJob
uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses datagen.GenerateRandom
uses datagen.GenerateTest
uses view.JobDrillDown
uses view.FailedJobView
uses view.JobStatusFeedList
uses java.util.UUID
uses jobs.TestJob

class JobController implements IHasRequestContext {

  static var UUId : String

  static function startTestJob() {
    var testJob = new TestJob()
    testJob.start()
    return
  }

  static function startGenerateJob() {
    new GenerateRandom().generateRandom('data.json')
    var job = new GenerateJob('data.json', UUID.randomUUID().toString()).start()
    UUId = job.UUId
    return
  }

  static function startGenerateTestJob(testVar : String) {
    new GenerateTest().generateTest('dataReach.json', testVar, 40000)
    var job = new GenerateJob('dataReach.json', UUID.randomUUID().toString()).start()
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

  static function startRecommendJob(collection : String) : String {
    new RecommendJob(collection).start()
    return view.Root.renderToString()
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

}