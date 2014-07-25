package controller

uses sparkgs.util.IHasRequestContext

uses jobs.Job
uses jobs.RecommendJob
uses view.jobs.JobDrillDown
uses view.jobs.JobStatusFeedList
uses jobs.TestJob
uses jobs.SalesforceAuthJob
uses sparkgs.IResourceController
uses view.jobs.JobTable
uses view.jobs.JobTableBody
uses view.jobs.SubJobTableBody
uses java.text.SimpleDateFormat
uses jobs.DataUploadJob
uses java.lang.IllegalStateException
uses model.Company

class JobController implements IHasRequestContext, IResourceController {

  override function index() : Object {
    var status = Params['status'] ?: "all"
    return JobTable.renderToString(status, Job.findByStatus(status).paginate(Params['page']))
  }

  function table() : Object {
    var status = Params['status'] ?: "all"
    return raw(JobTableBody.renderToString(status, Job.findByStatus(status).paginate(Params['page'])))
  }

  function subJobTable(UUID : String) : Object {
    var jobs = (Job.findJob(UUID) as RecommendJob).SubJobs
    return raw(SubJobTableBody.renderToString(UUID,Job.findByIDs(jobs?.map(\ j -> j.UUId))?.paginate(Params['page'])))
  }

  function generateProgress() : Object {
    var progress = Job.findJob(Session['UUId'] as String)?.Progress
    if (progress == 100) cancelPolling()
    return raw(progress + "%")
  }

  function generateComplete() : Object {
    if (Job.findJob(Session['UUId'] as String)?.Progress == 100) {
      cancelPolling()
      return raw('<div class="fa fa-check chk navbar-left"</div>')
    }
    return  raw('<div></div>')
  }

  function complete(UUID : String) : Object {
    if (Job.findJob(UUID)?.Progress == 100) {
      cancelPolling()
      return raw('<div class="fa fa-check chk navbar-left"</div>')
    }
    return  raw('<div></div>')
  }

  function created(UUID : String) : Object {
    var sdf = new SimpleDateFormat("MMM d, 'at' h:mm a")
    return sdf.format(Job.findJob(UUID)?.StartTime)
  }

  function cancel(UUID : String) : String {
    Job.findJob(UUID)?.cancel()
    return null
  }

  function reset(UUID : String) : String {
    Job.findJob(UUID)?.reset()
    return null
  }

  function delete(UUID : String) : String {
    Job.findJob(UUID)?.delete()
    return null
  }

  function deleteBulk() : String {
    for (UUID in Params.all('jobcheckbox[]')) {
      var job = Job.findJob(UUID)
      if(job.Progress == 100 || job.Cancelled || job.Failed) {
        job.delete()
      }
    }
    return null
  }

  function cancelBulk() : String {
    for (UUID in Params.all('jobcheckbox[]')) {
      var job = Job.findJob(UUID)
      if(job.Progress < 100 && !(job.Cancelled || job.Failed)) {
        job.cancel()
      }
    }
    return null
  }

  function resetBulk() : String {
    for (UUID in Params.all('jobcheckbox[]')) {
      var job = Job.findJob(UUID)
      if(job.Cancelled || job.Failed) {
        job.reset()
      }
    }
    return null
  }

  function progress(UUID : String) : Object {
    var progress = Job.findJob(UUID)?.Progress
    if (progress == 100) cancelPolling()
    return raw(progress+"%")
  }

  function status(UUID : String) : Object {
    var job = Job.findJob(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(job?.Status)
  }

  function elapsed(UUID : String) : Object {
    var job = Job.findJob(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(job?.ElapsedTime)
  }

  function statusFeed(UUID : String) : Object {
    var job = Job.findJob(UUID)
    if (job?.Progress == 100) cancelPolling()
    return raw(JobStatusFeedList.renderToString(job?.StatusFeed, UUID))
  }

  override function create() : Object {
    var job : jobs.Job
    switch(Params['type']) {
      case 'test' :
        job = new TestJob()
        break
      case 'recommend' :
        job = new RecommendJob()
        (job as RecommendJob).Fields = Params.all('Fields[]')?.toList()
        break
      case 'generate' :
        if (!verifyCollection()) return ""
        job = new DataUploadJob()
        job.put('Body', Request.Body)
        Session['UUId'] = job.UUId
        break
      case 'auth' :
        job = new SalesforceAuthJob(Request.Session.attribute("code"), Params.all('resultcheckbox[]'))
        break
      default:
        throw new IllegalStateException("No such job type")
    }
    job.updateFrom(Request.QueryMap.get({job.IntrinsicType.DisplayName}).toMap().mapValues(\ o -> o.first()))
    job.save()
    job.start()
    Headers['X-IC-Redirect'] = "/jobs/${job.UUId}"
    return show(job.UUId)
  }

  override function _new() : Object {
    return null
  }

  override function show(id: String) : Object {
     return JobDrillDown.renderToString(Job.findJob(id))
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

  function verifyCollection() : boolean {
    if (!Company.validCollection(Request.QueryMap.get({DataUploadJob.Type.DisplayName}).toMap()['DataSetCollection'].first())){
      Headers['X-IC-Script'] = 'alert("Duplicate data set name; choose another!");'
      Headers['X-IC-Redirect'] = "/datasets/new"
      return false
    }
    return true
  }


}