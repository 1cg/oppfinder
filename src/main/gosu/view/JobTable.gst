<%@ params(jobs: java.util.Iterator<jobs.Job>, header : String, type : String) %>
<div class="page-header">
  <h1>${header}</h1>
</div>
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
    <% if (!jobs.hasNext()) { %>
      <div class="alert alert-info alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        <strong>Attention: </strong> There are currently no ${type} jobs in the database
      </div>
    <%  } else {
    for(job in jobs) { %>
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
          <div class="progress-bar"  role="progressbar" aria-valuenow="${job.Progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${job.Progress}%">
            <span class="sr-only">${job.Progress}% Complete</span>
          </div>
        </div>
      </td>
    <% if (job.Progress < 100 && !job.Cancelled) { %>
      <td>
        <button ic-post-to="/jobs/${job.UUId}/cancel" class="btn btn-danger btn-sm" role="button"><b>&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;&nbsp;</b></button>
      </td>
   <% } if (job.Cancelled) { %>
      <td>
        <button ic-post-to="/jobs/${job.UUId}/reset" class="btn btn-info btn-sm" role="button"><b>&nbsp;&nbsp;&nbsp;Reset&nbsp;&nbsp;&nbsp;</b></button>
      </td>
   <% } }
} %>
  </tbody>
</table>