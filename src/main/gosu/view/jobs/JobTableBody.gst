<%@ params(type: String, pager: util.iterable.PagerIterable<jobs.Job>) %>
<div ic-src='jobs/table?status=${type}&page=${pager.Current}' ic-deps="/jobs">

<% if ((pager == null) || (pager.Current == 1 && pager.Count == 0)) { %>
  <div class="inset-8">
    <div class="alert alert-info alert-dismissable">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <strong>Attention: </strong> There are currently no ${type} jobs in the database
    </div>
  </div>
<% } %>

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
          Created
        </th>
        <th>
          Total Time
        </th>
        <th>
          Progress
        </th>
        <th>
          Actions
        </th>
        <th>
          <input type="checkbox" onClick="toggle(this, 'jobcheckbox[]')">
        </th>
      </tr>
    </thead>
    <tbody>
     <% for(job in pager)  {
       if (job != null) { %>
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
          ${new controller.JobController().created(job.UUId)}
        </td>
        <td>
          <div ic-src="/jobs/${job.UUId}/elapsed" ic-transition="none" ic-poll="5s">${job.ElapsedTime}</div>
        </td>
        <td>
          <% if (!job.Cancelled && job.Progress != 100 && !job.Failed) { %>
            <div class="progress progress-striped active">
              <div class="progress-bar" ic-style-src="width:/jobs/${job.UUId}/progress"
                ic-poll="1s"
                style="width:${job.Progress}%">
              </div>
            </div>
          <% } %>
        </td>
        <td class="no-wrap">
          <div class="relative">
            <div class="row-action-btns">
              <% if (job.Progress == 100 || job.Cancelled || job.Failed)  { %>
                <button ic-confirm="Are you sure you want to delete this job?" ic-post-to="/jobs/${job.UUId}/delete" class="btn btn-danger btn-sm" role="button"><span class="glyphicon glyphicon-trash"></span></button>
              <% } %>
              <% if (job.Progress < 100 && !(job.Cancelled || job.Failed)) { %>
                <button ic-post-to="/jobs/${job.UUId}/cancel" class="btn btn-danger btn-sm" role="button"><span class="glyphicon glyphicon-stop"></span></button>
              <% }  else if (job.Cancelled || job.Failed) { %>
                <button ic-post-to="/jobs/${job.UUId}/reset" class="btn btn-primary btn-sm" role="button"><span class="glyphicon glyphicon-repeat"></span></button>
              <% } %>
            </div>
          </div>
        </td>
        <td>
          <input type="checkbox" name="jobcheckbox[]" value=${job.UUId}>
        </td>
     </tr>
     <% }} %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(pager)}
</div>
