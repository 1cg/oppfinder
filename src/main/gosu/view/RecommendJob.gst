<%@ params(job : jobs.RecommendJob) %>
<% var ds : model.DataSet = job.ResultsData %>
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
  <% for (result in ds.find()) {%>
    <tr>
      <td>
        ${result.get('Company')}
      </td>
      <td>
        ${result.get('Policy')}
      </td>
      <td>
        ${result.get('Value')}
      </td>
    </tr>
  <% } %>
  </tbody>
</table>