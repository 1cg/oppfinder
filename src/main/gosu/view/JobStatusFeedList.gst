<%@ params(statusFeed : String, progress : int) %>
<div class="panel panel-primary">
 <div class="panel-heading">Job Status Update (${progress}% Complete)</div>
  <ul class="list-group" >
    <% for (feed in statusFeed.split("\\n")) { %>
    <li class="list-group-item"><span class="glyphicon glyphicon-ok"></span>  ${feed}</li>
    <% } %>
  </ul>
</div>