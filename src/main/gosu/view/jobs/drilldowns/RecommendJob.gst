<%@ params(job : jobs.RecommendJob) %>
<% if (model.Results.getResults(job?.UUId)?.size() > 0) { %>
  <hr>
  <h3 class="sub-section-header">Results!</h3>
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
<%}%>
<hr>
<h3 class="sub-section-header">Sub Jobs</h3>
<div>
  ${new controller.JobController().subJobTable(job?.UUId)}
</div>