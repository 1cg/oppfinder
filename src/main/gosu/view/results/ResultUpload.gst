<% uses gw.lang.reflect.features.PropertyReference
   uses input_helper.InputGenerator %>
<%@ params(results : PropertyReference) %>
<div class='jumbotron'>
  <h2>Select a dataset to upload to Salesforce</h2>
  <form class="form-inline" role="form" ic-post-to="/jobs?type=auth">
    ${InputGenerator.select(results, 'Select Dataset', {'class' -> 'form-control', 'name' -> 'jobs.SalesforceAuthJob[ResultCollection]'})}
    ${InputGenerator.submit('Start upload to Salesforce', {'class' -> 'btn btn-primary'})}
   </form>
</div>
