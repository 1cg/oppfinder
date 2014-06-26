package controller

uses sparkgs.util.IHasRequestContext

uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses view.JobDrillDown
uses view.FailedJobView
uses view.JobStatusFeedList
uses jobs.TestJob
uses util.GenerateJobFormParser
uses sparkgs.IResourceController
uses view.JobTable

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  static function startTestJob() {
    var testJob = new TestJob()
    testJob.start()
    return
  }

  static function startGenerateJob(formInput : String) {
    var form = new GenerateJobFormParser(formInput)
    var job = form.startJob()
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

  static function renderJobInfo(UUID: String): String {
    var job = Job.newUp(UUID, null)
    var response = ""
    var failed = job.Failed
    if (job == null) return "Oops, this appears to be an invalid UUID"
    response += JobDrillDown.renderToString(job)
    if (failed) response += FailedJobView.renderToString(job)
    response += JobStatusFeedList.renderToString(job)
    if (!failed) response += job.renderToString()
    return response
  }

  function progress(UUID : String) {
    Writer.append(Job.getUUIDProgress(UUID))
  }

  function generateProgress() {
    Writer.append(Job.getUUIDProgress(UUId))
  }

  function generateComplete() {
    if (Job.getUUIDProgress(UUId) == "100%") {
      Writer.append('<div class="fa fa-check green navbar-left" style="padding-left:10px;padding-top:4px;"</div>')
    } else {
      Writer.append('<div></div>')
    }
  }

  override function index() {
    var status = Params['status']
    var page = Params['page']?.toLong()
    if (status == null) {
      Writer.append(JobTable.renderToString("All Jobs", "all", PagerController.getPager("all",page)))
    } else if (status == "completed") {
      Writer.append(JobTable.renderToString("Completed Jobs", "completed", PagerController.getPager("completed",page)))
    } else if (status == "running") {
      Writer.append(JobTable.renderToString("Running Jobs", "running", PagerController.getPager("running",page)))
    } else if (status == "failed") {
      Writer.append(JobTable.renderToString("Failed Jobs", "failed", PagerController.getPager("failed",page)))
    } else {
      Writer.append(JobTable.renderToString("Cancelled Jobs", "cancelled", PagerController.getPager("cancelled",page)))
    }
  }

  override function _new() {
  }

  override function create() {
  }

  override function show(id: String) {
  }

  override function edit(id: String) {
  }

  override function update(id: String) {
  }
}