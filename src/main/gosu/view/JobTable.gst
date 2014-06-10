<%@ params(header : String, type : String, page : int)%>
<% var pager : model.Pager
    if (type == "complete") {
      pager = new model.Pager(jobs.Job.CompleteJobs,10)
    } else if (type == "running") {
      pager = new model.Pager(jobs.Job.ActiveJobs,10)
    } else {
      pager = new model.Pager(jobs.Job.CancelledJobs,10)
    }
    pager.getPage(page)
%>
<div class="page-header">
  <h1>${header}</h1>
</div>
<div ic-src="/jobs/table/${type}/${page}">
  ${view.JobTableBody.renderToString(type, page)}
</div>