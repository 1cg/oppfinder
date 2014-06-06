<%@ params( job: jobs.Job) %>
<% if (job == null) { %>
  <div class="alert alert-danger alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Oops! </strong> This doesn't appear to be a valid job id
  </div>
<% return } %>
${JobTable.renderToString({job}, "Job info for job: "  + job.UUId, "complete")}
${job.renderToString()}