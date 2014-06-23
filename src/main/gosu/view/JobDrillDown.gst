<%@ params( job: jobs.Job) %>
<% if (job == null) { %>
  <br><br>
  <div class="alert alert-danger alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Oops! </strong> This doesn't appear to be a valid job id
  </div>
<% return } %>
<h1>Specific job details: (${job.UUId})</h1>
<br>
<h3>Job Id: <span class="label label-default">${job.UUId}</span></h3>
<h3>Job Type: <span class="label label-default">${job.Type}</span></h3>
<h3>Elapsed Time: <span class="label label-default">${job.ElapsedTime}</span></h3>
${job.renderToString()}
<div ic-src="/jobs/${job.UUId}/status_feed" ic-poll="1s" ic-transition="none">
  ${jobs.Job.getStatusFeed(job.UUId)}
</div>
