<%@ params(UUID : String, pager: util.iterable.PagerIterable<jobs.Job>) %>
<div ic-src=${'/jobs/'+UUID+'/subjobtable?page='+(pager == null ? 1 : pager.Current)} ic-poll="3s" ic-transition="none" ic-deps="/jobs">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>
          Job Id
        </th>
        <th>
          Job Status
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
        <th>
          Actions
        </t>
      </tr>
    </thead>
    <tbody>
      <%
       if (pager == null || pager.Count == 0) { %>
        <br>
        <div class="alert alert-info alert-dismissable">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
          <strong>Attention: </strong> There are currently no sub jobs spawned. Please wait a moment.
        </div>
      <% return } else {
      for(job in pager)  {%>
      <tr>
        <td>
          <a href='/jobs/${job.UUId}'>${job.UUId}</a>
        </td>
        <td>
          ${job.Status}
        </td>
        <td>
          ${job.Type}
        </td>
        <td>
          <div ic-src="/jobs/${job.UUId}/elapsed" ic-transition="none" ic-poll="5s">${job.ElapsedTime}</div>
        </td>
        <td>
          <% if (!job.Cancelled && job.Progress != 100 && !job.Failed) { %>
            <div class="progress progress-striped active">
              <div class="progress-bar" ic-style-src="width:/jobs/${job.UUId}/progress"
                ic-poll="3s"
                style="width:${job.Progress}%">
              </div>
            </div>
          <% } %>
        </td>
        <td>
          <% if (job.Progress == 100 || job.Cancelled || job.Failed)  { %>
            <button ic-post-to="/jobs/${job.UUId}/delete" class="btn btn-danger btn-sm" role="button"><span class="glyphicon glyphicon-trash"></span></button>
          <% } %>
          <% if (job.Progress < 100 && !(job.Cancelled || job.Failed)) { %>
            <button ic-post-to="/jobs/${job.UUId}/cancel" class="btn btn-danger btn-sm" role="button"><span class="glyphicon glyphicon-stop"></span></button>
          <% }  else if (job.Cancelled || job.Failed) { %>
            <button ic-post-to="/jobs/${job.UUId}/reset" class="btn btn-primary btn-sm" role="button"><span class="glyphicon glyphicon-repeat"></span></button>
          <% } %>

        </td>
     </tr>
     <% }
    } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(pager)}
</div>
