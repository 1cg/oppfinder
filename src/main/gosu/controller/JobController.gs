package controller

uses sparkgs.util.IHasRequestContext

uses jobs.Job
uses jobs.UploadJob
uses jobs.RecommendJob
uses view.JobDrillDown
uses view.JobStatusFeedList
uses jobs.TestJob
uses util.GenerateJobFormParser
uses jobs.SalesforceAuthJob
uses sparkgs.IResourceController
uses view.JobTable
uses view.JobTableBody
uses view.Layout
uses view.SalesforceUpload

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  // TODO cgross - update sparkgs to allow return values for this
  override function index() {
    var status = Params['status'] ?: "all"
    Writer.append(Layout.renderToString(JobTable.renderToString(status, Job.findByStatus(status).paginate(Params['page']))))
  }

  function table() : Object {
    var status = Params['status'] ?: "all"
    return raw(JobTableBody.renderToString(status, Job.findByStatus(status).paginate(Params['page'])))
  }

  function subJobTable(UUID : String) : Object {
    var jobs = (Job.find(UUID) as RecommendJob).SubJobs
    return raw(JobTableBody.renderToString("Sub Jobs",Job.findByIDs(jobs.map(\ j -> j.UUId)).paginate(Params['page'])))
  }

  function _auth() {
    Writer.append(Layout.renderToString(SalesforceUpload.renderToString(Params['code'])))
  }

  function generateProgress() : Object {
    return raw(Job.find(UUId)?.Progress+"%")
  }

  function generateComplete() : Object {
    return (Job.find(UUId)?.Progress == 100) ? raw('<div class="fa fa-check chk navbar-left"</div>') : raw('<div></div>')
  }

  function cancel(UUID : String) {
    Job.find(UUID).cancel()
    return
  }

  function reset(UUID : String) {
    Job.find(UUID).reset()
    return
  }

  function delete(UUID : String) {
    Job.find(UUID).delete()
    return
  }

  function progress(UUID : String) : Object {
    return raw(Job.find(UUID).Progress+"%")
  }

  function elapsed(UUID : String) : Object {
    return raw(Job.find(UUID).ElapsedTime)
  }

  function statusFeed(UUID : String) : Object {
    return raw(JobStatusFeedList.renderToString(Job.find(UUID).StatusFeed, UUID))
  }

  override function create() {
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
  }

  override function _new() {
  }

  // TODO cgross - update sparkgs to allow return values for this
  override function show(id: String) {
    Writer.append(JobDrillDown.renderToString(Job.find(id)))
  }

  override function edit(id: String) {
  }

  override function update(id: String) {
  }
}