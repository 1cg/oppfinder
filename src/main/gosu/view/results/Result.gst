<%@ params(id : String, results : java.util.List<model.Result>, loggedIn : Boolean, source : String) %>
<%@ extends sparkgs.SparkGSTemplate %>
<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">Modal header</h3>
  </div>
  <div class="modal-body">
    <p>One fine body…</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
  </div>
</div>

<div>
  <h2 class="page-title">Results</h2>
</div>
<form>
  <% if (loggedIn) { %>
  <a ic-post-to="/jobs?type=auth&jobs.SalesforceAuthJob[ResultCollection]=${id}" class="btn btn-primary pull-right">Upload</a>
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

<div class="detail-row">
  <span class="detail-lable">Click to see </span>
  <span class="detail-value">
</span>
</div>
<a href="#myModal" role="button" class="btn" data-toggle="modal">Launch demo modal</a>


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
        ${result.Company}
      </td>
      <td>
        ${result.get('Policy')}
      </td>
      <td>
        ${result.Value}
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
