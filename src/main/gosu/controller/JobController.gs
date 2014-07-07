package controller

uses sparkgs.util.IHasRequestContext

uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses view.jobs.JobDrillDown
uses view.jobs.JobStatusFeedList
uses jobs.TestJob
uses util.GenerateJobFormParser
uses jobs.SalesforceAuthJob
uses sparkgs.IResourceController
uses view.jobs.JobTable
uses view.jobs.JobTableBody
uses view.jobs.SubJobTableBody

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  override function index() : Object {
    var status = Params['status'] ?: "all"
    return JobTable.renderToString(status, Job.findByStatus(status).paginate(Params['page']))
  }

  function table() : Object {
    var status = Params['status'] ?: "all"
    return raw(JobTableBody.renderToString(status, Job.findByStatus(status).paginate(Params['page'])))
  }

  function subJobTable(UUID : String) : Object {
    var jobs = (Job.find(UUID) as RecommendJob).SubJobs
    return raw(SubJobTableBody.renderToString(UUID,Job.findByIDs(jobs?.map(\ j -> j.UUId))?.paginate(Params['page'])))
  }

  function generateProgress() : Object {
    var progress = Job.find(UUId)?.Progress+"%"
    if (progress == "100%") cancelPolling()
    return raw(progress)
  }

  function generateComplete() : Object {
    if (Job.find(UUId)?.Progress == 100) {
      cancelPolling()
      return raw('<div class="fa fa-check chk navbar-left"</div>')
    }
    return  raw('<div></div>')
  }

  function complete(UUID : String) : Object {
    if (Job.find(UUID)?.Progress == 100) {
      cancelPolling()
      return raw('<div class="fa fa-check chk navbar-left"</div>')
    }
    return  raw('<div></div>')
  }

  function cancel(UUID : String) : String {
    Job.find(UUID)?.cancel()
    return null
  }

  function reset(UUID : String) : String {
    Job.find(UUID)?.reset()
    return null
  }

  function delete(UUID : String) : String {
    Job.find(UUID)?.delete()
    return null
  }

  function progress(UUID : String) : Object {
    var job = Job.find(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(job?.Progress+"%")
  }

  function elapsed(UUID : String) : Object {
    var job = Job.find(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(job?.ElapsedTime)
  }

  function statusFeed(UUID : String) : Object {
    var job = Job.find(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(JobStatusFeedList.renderToString(job?.StatusFeed, UUID))
  }

  override function create() : Object {
    var UUID : String
    if (Params['type'] == "test") {
      UUID = new TestJob().start().UUId
    } else if (Params['type'] == 'recommend') {
      UUID = new RecommendJob(Params['collections']).start().UUId
    } else if (Params['type'] == 'upload') {
      UUId = new UploadJob(Request.Body).start().UUId
      UUID = UUId
    } else if (Params['type'] == 'generate') {
      UUId = GenerateJobFormParser.startJob(Params['dataSetName'], Params['generateStrategy']).UUId
      UUID = UUId
    } else if (Params['type'] == 'auth') {
      UUId = new SalesforceAuthJob(Params['id'], Request.Session.attribute("code")).start().UUId
      UUID = UUId
    }
    Headers['X-IC-Redirect'] = "/jobs/${UUID}"
    return show(UUID)
  }

  override function _new() : Object {
    return null
  }

  override function show(id: String) : Object {
     return JobDrillDown.renderToString(Job.find(id))
  }

  override function edit(id: String) : Object {
    return null
  }

  override function update(id: String) : Object {
    return null
  }

  function cancelPolling() {
    Headers['X-IC-CancelPolling'] = true as String
  }


}