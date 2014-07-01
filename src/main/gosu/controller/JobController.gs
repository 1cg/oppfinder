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
uses jobs.SalesforceAuthJob
uses sparkgs.IResourceController
uses view.JobTable
uses view.JobTableBody
uses view.Layout
uses util.PagerIterable

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  function table() {
    var status = Params['status'] ?: "all"
    var page = Params['page'] == null ? 1 : Params['page'].toLong()
    Writer.append(JobTableBody.renderToString(status, new util.PagerIterable<jobs.Job>(RequestedData,page)))
  }

  function generateProgress() : String {
    return Job.getUUIDProgress(UUId)
  }

  function generateComplete() {
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

  static function startSalesforceAuthJob(id : String, authCode: String) {
    var salesforceAuthJob = new SalesforceAuthJob(id, authCode)
    salesforceAuthJob.start()
    return
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

  function progress(UUID : String) : String {
    return Job.getUUIDProgress(UUID)
  }

  function elapsed(UUID : String) : String {
    return Job.getUUIDElapsedTime(UUID)
  }

  function statusFeed(UUID : String) : String {
    return JobStatusFeedList.renderToString(Job.newUp(UUID, null))
  }

  override function create() {
    if (Params['type'] == "test") {
      new TestJob().start()
    } else if (Params['type'] == 'recommend') {
      new RecommendJob(Params['collections']).start()
    } else if (Params['type'] == 'upload') {
      new UploadJob(Request.Body).start()
    } else if (Params['type'] == 'generate') {
      var form = new GenerateJobFormParser(Request.Body).startJob()
    }
  }

  override function index() {
    var page = Params['page'] == null ? 1 : Params['page'].toLong()
    var status = Params['status'] ?: 'all'
    Writer.append(Layout.renderToString(JobTable.renderToString(status, new PagerIterable<jobs.Job>(RequestedData, page))))
  }

  private property get RequestedData() : util.SkipIterable<jobs.Job> {
    var status = Params['status'] ?: 'all'
    if (status == 'all') {
      return Job.AllJobs
    } else if (status == 'failed') {
      return Job.FailedJobs
    } else if (status == 'cancelled') {
      return Job.CancelledJobs
    } else if (status == 'running') {
      return Job.ActiveJobs
    } else if (status == 'completed') {
      return Job.CompleteJobs
    }
    throw "Unsupported state for requested data"
  }

  override function _new() {
  }

  override function show(id: String) {
    var job = Job.newUp(id, null)
    var response = ""
    var failed = job.Failed
    if (job == null) {
      Writer.append(Layout.renderToString("Oops, this appears to be an invalid UUID"))
      return
    }
    response += JobDrillDown.renderToString(job)
    if (failed) response += FailedJobView.renderToString(job)
    response += JobStatusFeedList.renderToString(job)
    if (!failed) response += job.renderToString()
    Writer.append(Layout.renderToString(response))
  }

  override function edit(id: String) {
  }

  override function update(id: String) {
  }
}