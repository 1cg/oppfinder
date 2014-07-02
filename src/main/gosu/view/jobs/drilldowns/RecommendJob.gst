package view.jobs.drilldowns

    <%@ params(job : jobs.RecommendJob) %>
<% if (model.Results.getResults(job?.UUId)?.size() > 0) { %>
  <hr>
  <h2> Results!</h2>
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
<h2>Sub Jobs</h2>
<div ic-src="/jobs/${job.UUId}/subjobtable" ic-poll="3s" ic-transition="none" ic-deps="/jobs">
  ${new controller.JobController().subJobTable(job?.UUId)}
</div>