<%@ params(pager : model.Pager<java.util.Map<Object,Object>>)%>
${pager.Page.size()}
<table class="table">
  <thead>
    <tr>
      <% for (type in model.Company.CompanyDataTypes) { %>
        <th> ${type} </th>
      <% } %>
    </tr>
  </thead>
  <tbody>
    <% for (entry in pager.getPage()) { %>
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
${widgets.PagerWidget.renderWidget(pager,"/companies/", null)}

