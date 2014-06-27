<%@ params(job : jobs.RecommendJob) %>
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
  <% for (result in model.Results.getResults(job.UUId)) {%>
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