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
uses view.jobs.drilldowns.SalesforceUpload

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
    return raw(JobTableBody.renderToString("Sub Jobs",Job.findByIDs(jobs.map(\ j -> j.UUId)).paginate(Params['page'])))
  }

  function _auth() : String {
    return SalesforceUpload.renderToString(Params['code'])
  }

  function generateProgress() : Object {
    return raw(Job.find(UUId)?.Progress+"%")
  }

  function generateComplete() : Object {
    return (Job.find(UUId)?.Progress == 100) ? raw('<div class="fa fa-check chk navbar-left"</div>') : raw('<div></div>')
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
    return raw(Job.find(UUID)?.Progress+"%")
  }

  function elapsed(UUID : String) : Object {
    return raw(Job.find(UUID)?.ElapsedTime)
  }

  function statusFeed(UUID : String) : Object {
    return raw(JobStatusFeedList.renderToString(Job.find(UUID)?.StatusFeed, UUID))
  }

  override function create() : Object {
    if (Params['type'] == "test") {
      new TestJob().start()
    } else if (Params['type'] == 'recommend') {
      new RecommendJob(Params['collections']).start()
    } else if (Params['type'] == 'upload') {
      UUId = new UploadJob(Request.Body).start().UUId
    } else if (Params['type'] == 'generate') {
      UUId = GenerateJobFormParser.startJob(Params['dataSetName'], Params['generateStrategy']).UUId
    } else if (Params['type'] == 'auth') {
      new SalesforceAuthJob(Params['id'], Params['code']).start()
    }
    return null
  }

  override function _new() : Object{
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
}