<%@ params(jobs: java.util.Iterator<jobs.Job>, header : String, type : String, page : int)%>
<% var pager = new model.Pager(jobs, 10) %>
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
    for(job in pager.getPage(page)) { %>
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
        <button ic-post-to="/jobs/${job.UUId}/cancel" class="btn btn-danger btn-sm" role="button"><b>Cancel</b></button>
      </td>
   <% } else if (job.Cancelled) { %>
      <td>
        <button ic-post-to="/jobs/${job.UUId}/reset" class="btn btn-info btn-sm" role="button"><b>Reset</b></button>
      </td>
   <% } }
} %>
  </tbody>
</table>
<ul class="pagination navbar-right">
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
