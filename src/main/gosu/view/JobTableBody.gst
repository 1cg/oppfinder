<%@ params(type: String, page: int ) %>
<% var pager : model.Pager<jobs.Job>
  if (type == "complete") {
    pager = new model.Pager<jobs.Job>(jobs.Job.CompleteJobs,10)
} else if (type == "running") {
    pager = new model.Pager<jobs.Job>(jobs.Job.ActiveJobs,10)
} else {
    pager = new model.Pager<jobs.Job>(jobs.Job.CancelledJobs,10)
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
        <div ic-src="/jobs/${job.UUId}/elapsed_time" ic-transition="none" ic-poll="1s">${job.ElapsedTime}</div>
      </td>
      <td>
        <div class="progress progress-striped active">
          <div class="progress-bar"
            ic-style-src="width:/jobs/${job.UUId}/percent_done"
            ic-poll="1s" style="width:${jobs.Job.getUUIDProgress(job.UUId)}"></div>
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
