<%@ extends input_helper.InputGenerator %>
<%@ params(results : List<String>) %>
<h2>Upload to Salesforce</h2>
<hr>
<h4>Select a dataset up upload</h4>
<div class='jumbotron'>
  <form class="form-inline" role="form" ic-post-to="/jobs?type=auth">
    ${selectInputCollection(results, 'Data sets ', {'class' -> 'form-control', 'name' -> 'jobs.SalesforceAuthJob[ResultCollection]'})}
    ${submitInput('Start upload to Salesforce', {'class' -> 'btn btn-primary'})}
   </form>
</div>
