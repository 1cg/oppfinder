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

class JobController implements IHasRequestContext, IResourceController {

  static var UUId : String

  // TODO cgross - update sparkgs to allow return values for this
  override function index() {
    Writer.append(JobTable.renderToString(Params['status'],Job.findByStatus(Params['status']).paginate(Params['page'])))
  }

  function table() : Object {
    return raw(JobTableBody.renderToString(Params['status'], Job.findByStatus(Params['status']).paginate(Params['page'])))
  }

  function generateProgress() : Object {
    return raw(Job.find(UUId)?.Progress)
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
      new UploadJob(Request.Body).start()
    } else if (Params['type'] == 'generate') {
      new GenerateJobFormParser(Request.Body).startJob()
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