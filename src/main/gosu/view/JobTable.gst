<%@ params(header : String, type : String, page : int)%>
<% var pager : model.Pager
    if (type == "complete") {
      pager = new model.Pager(jobs.Job.CompleteJobs,10)
    } else if (type == "running") {
      pager = new model.Pager(jobs.Job.ActiveJobs,10)
    } else {
      pager = new model.Pager(jobs.Job.CancelledJobs,10)
    }
%>
<div class="page-header">
  <h1>${header}</h1>
</div>
<div ic-src="/jobs/table/${type}/${page}">
  ${view.JobTableBody.renderToString(type, page)}
</div>
<ul class="pagination navbar-right">
  <li><button ic-post-to="/jobs/table/${type}/${page}" class="btn btn-info btn-md" role="button"><b>Refresh</b></button></li>
  <li class=${pager.checkStatus(pager.Current -1)}>
    <a href="/jobs/${type}/${java.lang.Math.max(pager.Current -1, 1)}">&laquo;</a>
  </li>
  <% for (i in -2..2) { %>
  <li class=${pager.checkStatus(java.lang.Math.max(pager.Current + i, i + 3))}>
    <a href="/jobs/${type}/${java.lang.Math.max(pager.Current +i, i + 3)}">${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
  </li>
  <% } %>
  <li class=${pager.checkStatus(pager.Current +1)}>
    <a href="/jobs/${type}/${pager.Current +1}">&raquo;</a>
  </li>
</ul>