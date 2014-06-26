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
uses view.JobTableBody

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  function table() {
    var status = Params['status'] ?: "all"
    var page = Params['page'] == null ? 1 : Params['page'].toLong()
    Writer.append(JobTableBody.renderToString(status, PagerController.getPager(status,page)))
  }

  function generateProgress(id : String) : String {
    return Job.getUUIDProgress(UUId)
  }

  function generateComplete(id : String) {
    if (Job.getUUIDProgress(UUId) == "100%") {
      Writer.append('<div class="fa fa-check green navbar-left" style="padding-left:10px;padding-top:4px;"</div>')
    } else {
      Writer.append('<div></div>')
    }
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

  function cancel(UUID : String) {
    Job.cancel(UUID)
    return
  }

  function reset(UUID : String) {
    Job.reset(UUID)
    return
  }

  function delete(UUID : String) {
    Job.delete(UUID)
    return
  }

  function getUUIDProgress(UUID : String) : String {
    return Job.getUUIDProgress(UUID)
  }

  function getUUIDElapsedTime(UUID : String) : String {
    return Job.getUUIDElapsedTime(UUID)
  }

  function statusFeed(UUID : String) : String {
    return JobStatusFeedList.renderToString(Job.newUp(UUID, null))
  }

  function startUpload() {
    new UploadJob(Request.Body).start()
    return
  }

  function startRecommend() {
    new RecommendJob(Request.Body.toString().split("=")[1]).start()
    return
  }

  function startTest() {
    var testJob = new TestJob()
    testJob.start()
    return
  }

  function startGenerate() {
    var form = new GenerateJobFormParser(Request.Body)
    var job = form.startJob()
    UUId = job.UUId
    return
  }

  function progress(UUID : String) {
    Writer.append(Job.getUUIDProgress(UUID))
  }

  override function index() {
    var status = Params['status'] ?: "all"
    var page = Params['page'] == null ? 1 : Params['page'].toLong()
    Writer.append(JobTable.renderToString(status, PagerController.getPager(status, page)))
  }

  override function _new() {
  }

  override function create() {
  }

  override function show(id: String) {
    print(id)
    var job = Job.newUp(id, null)
    var response = ""
    var failed = job.Failed
    if (job == null) {
      Writer.append("Oops, this appears to be an invalid UUID")
      return
    }
    response += JobDrillDown.renderToString(job)
    if (failed) response += FailedJobView.renderToString(job)
    response += JobStatusFeedList.renderToString(job)
    if (!failed) response += job.renderToString()
    Writer.append(response)
  }

  override function edit(id: String) {
  }

  override function update(id: String) {
  }
}