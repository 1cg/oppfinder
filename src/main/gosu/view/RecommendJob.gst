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
  <% for (result in job.ResultsData.find()) {%>
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