<%@ params(id : String, pager: util.iterable.PagerIterable<java.util.Map<Object,Object>>)%>
<h2>DataSet: ${id}</h2><br>
<a href='/datasets'><strong>Back to DataSets</strong></a>
<div id='wrapper'>
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
               ${entry[type]} <% } %>
            </td>
          <% } %>
        </tr>
      <% } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(pager)}
</div>

