<%@ params(feed : String, UUID : String) %>
<div ic-src="/jobs/${UUID}/statusfeed" ic-poll="1s" ic-transition="none">
  <div class="panel panel-primary">
   <div class="panel-heading">Job Status Update (${jobs.Job.find(UUID)?.Progress}% Complete)</div>
    <ul class="list-group" >
      <% for (item in feed?.split("\\n")) { %>
      <li class="list-group-item"><span class="glyphicon glyphicon-ok"></span>  ${item}</li>
      <% } %>
    </ul>
  </div>
</div>