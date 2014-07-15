<%@ params(id : String, results : java.util.List<java.util.Map<Object,Object>>, loggedIn : Boolean, source : String) %>
<%@ extends sparkgs.SparkGSTemplate %>
<div>
  <h2 class="page-title">Results</h2>
</div>
<form>
  <% if (loggedIn) { %>
  <a ic-post-to="/jobs?type=authselective&SalesForceAuthJob[ResultCollection]=${id}" class="btn btn-primary pull-right">Upload</a>
  <% } %>
<div class="detail-row">
  <span class="detail-label">Job Id: </span>
  <!-- TODO cgross  this should be a results object -->
  <span class="detail-value"><a href="/jobs/${Request.Params['id']}">${Request.Params['id']}</a></span>
</div>
<% if (source != "" && source != null) { %>
<div class="detail-row">
  <span class="detail-label">Source Data Set: </span>
  <span class="detail-value"><a href="/datasets/${java.net.URLEncoder.encode(source, 'UTF-8')}">${source}</a></span>
</div>
<%}%>
<table class="table">
  <thead>
    <tr>
      <th>
        Company
      </th>
      <th>
        Recommended Policy
      </th>
      <th>
        Value
      </th>
      <% if (loggedIn) { %>
      <th>
        <input type="checkbox" onClick="toggle(this, 'resultcheckbox[]')">
      </th>
      <% } %>
    </tr>
  </thead>
  <tbody>
  <% for (result in results index i) {%>
    <tr>
      <td>
        ${result['Company']}
      </td>
      <td>
        ${result['Policy']}
      </td>
      <td>
        ${result['Value']}
      </td>
      <% if (loggedIn) { %>
      <td>
        <input type="checkbox" name="resultcheckbox[]" value=${i}>
      </td>
      <% } %>
    </tr>
  <% } %>
  </tbody>
</table>
</form>
