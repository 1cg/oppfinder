<%@ params(pager : util.PagerIterable<java.util.Map>)%>
<table class="table">
  <thead>
    <tr>
      <% for (type in model.Company.CompanyDataTypes) { %>
        <th> ${type} </th>
      <% } %>
    </tr>
  </thead>
  <tbody>
    <% for (entry in pager) { %>
      <tr>
        <% for (type in model.Company.CompanyDataTypes) { %>
          <td> <% if (type == 'Policies') {
            for (policy in model.Company.PolicyBreakdown(entry[type] as String)){ %>
             ${policy}<br>
         <% }} else { %>
             ${entry[type]} <% } %> </td>
        <% } %>
      </tr>
    <% } %>
  </tbody>
</table>
${new widgets.PagerWidget().renderWidget(pager)}

