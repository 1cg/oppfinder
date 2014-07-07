<%@ params(feed : String, UUID : String) %>
<div class="panel panel-primary">
 <div class="panel-heading">Job Status Update (${jobs.Job.find(UUID)?.Progress}% Complete)</div>
  <ul class="list-group" >
    <% for (item in feed?.split("\\n")) { %>
    <li class="list-group-item"><span class="glyphicon glyphicon-ok"></span>  ${item}</li>
    <% } %>
  </ul>
</div>