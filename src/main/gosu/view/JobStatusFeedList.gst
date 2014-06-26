<%@ params(job : jobs.Job) %>
<div ic-src="/jobs/${job.UUId}/statusfeed" ic-poll="1s" ic-transition="none">
  <div class="panel panel-primary">
   <div class="panel-heading">Job Status Update (${job.Progress}% Complete)</div>
    <ul class="list-group" >
      <% for (feed in job.StatusFeed.split("\\n")) { %>
      <li class="list-group-item"><span class="glyphicon glyphicon-ok"></span>  ${feed}</li>
      <% } %>
    </ul>
  </div>
</div>