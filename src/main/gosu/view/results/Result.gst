<%@ params(code : String, results : java.util.List<java.util.Map<Object,Object>>) %>
<%@ extends sparkgs.SparkGSTemplate %>
<div>
  <h2 class="page-title">Results</h2>
</div>

<div class="detail-row">
  <span class="detail-label">Job Id: </span>
  <!-- TODO cgross  this should be a results object -->
  <span class="detail-value"><a href="/jobs/${Request.Params['id']}">${Request.Params['id']}</a></span>
</div>

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
    </tr>
  </thead>
  <tbody>
  <% for (result in results) {%>
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
    </tr>
  <% } %>
  </tbody>
</table>
