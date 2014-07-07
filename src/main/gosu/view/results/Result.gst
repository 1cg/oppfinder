<%@ params(id : String, results : java.util.List<java.util.Map<Object,Object>>, loggedIn : Boolean) %>
  <hr>
  <% if (loggedIn) { %>
  <a ic-post-to="/jobs?type=%auth&id=${id}" class="btn btn-primary pull-right">Upload</a>
  <% } %>
  <h2>Results for ${id}</h2>
<% if (results.size() > 0) { %>
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
<%} else { %>
  No recommendations available.
<% } %>