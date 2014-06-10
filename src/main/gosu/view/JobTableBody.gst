<%@ params(type: String, page: int ) %>
<% var pager : model.Pager
  if (type == "complete") {
    pager = new model.Pager(jobs.Job.CompleteJobs,10)
} else if (type == "running") {
    pager = new model.Pager(jobs.Job.ActiveJobs,10)
} else {
    pager = new model.Pager(jobs.Job.CancelledJobs,10)
  }%>
<table class="table">
  <thead>
    <tr>
      <th>
        Job Id
      </th>
      <th>
        Job Type
      </th>
      <th>
        Total Time
      </th>
      <th>
        Progress
      </th>
    </tr>
  </thead>
  <tbody>
    <%
     if (!pager.validPage(page) && page == 1) { %>
      <div class="alert alert-info alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        <strong>Attention: </strong> There are currently no ${type} jobs in the database
      </div>
    <%  } else if (!pager.validPage(page)) { %>
      <div class="alert alert-info alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        <strong>Attention: </strong> There are not this many ${type} jobs in the database; please go to an earlier page
      </div>
    <% } else {
    for(job in pager.getPage(page))  {%>
    <tr>
      <td>
        <a href='/jobs/${job.UUId}/info'>${job.UUId}</a>
      </td>
      <td>
        ${job.Type}
      </td>
      <td>
        ${job.ElapsedTime}
      </td>
      <td>
        <div class="progress progress-striped active">
          <div class="progress-bar"
            ic-style-src="width:/jobs/${job.UUId}/percent_done"
            ic-poll="1s" style="width:0%"></div>
        </div>
      </td>
    <% if (job.Progress < 100 && !job.Cancelled) { %>
      <td>
        <button ic-post-to="/jobs/${job.UUId}/cancel" class="btn btn-danger btn-sm" role="button"><b>Cancel</b></button>
      </td>
   <% } else if (job.Cancelled) { %>
      <td>
        <button ic-post-to="/jobs/${job.UUId}/reset" class="btn btn-info btn-sm" role="button"><b>Reset</b></button>
      </td>
   <% } %>
   </tr>
   <% }
  } %>
  </tbody>
</table>
<ul class="pagination navbar-right">
  <li><button ic-post-to="/jobs/table/${type}/${page}" class="btn btn-info btn-md" role="button"><b>Refresh</b></button></li>
  <li class=${pager.checkStatus(page -1)}>
    <a href="/jobs/${type}/${java.lang.Math.max(pager.Current -1, 1)}">&laquo;</a>
  </li>
  <% for (i in -2..2) { %>
  <li class=${pager.checkStatus(java.lang.Math.max(page + i, i + 3))}>
    <a href="/jobs/${type}/${java.lang.Math.max(pager.Current +i, i + 3)}">${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
  </li>
  <% } %>
  <li class=${pager.checkStatus(page +1)}>
    <a href="/jobs/${type}/${pager.Current +1}">&raquo;</a>
  </li>
</ul>