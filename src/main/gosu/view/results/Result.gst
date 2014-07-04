<%@ params(code : String, results : java.util.List<java.util.Map<Object,Object>>) %>
<% if (results.size() > 0) { %>
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
<%}%>