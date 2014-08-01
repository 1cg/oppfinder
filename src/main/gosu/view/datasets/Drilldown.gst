<%@ params(id : String, companies: model.database.iterable.PagerIterable<model.Company>)%>
<%@ extends input_helper.TagHelper %>
<div>
  <h2 class="page-title">DataSet: ${id}</h2>
  ${contentTag('a', 'Analyze Data Set',{'class' -> 'btn btn-primary pull-right', 'href' ->'/results/new?collection=' + id})}
</div>
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
      <% for (company in companies) { %>
        <tr>
          <% for (type in model.Company.CompanyDataTypes) { %>
            <% if (type == 'Policies') { %>
            <td style='white-space: nowrap'>
            <% for (policy in company.Policies){ %>
               ${policy}<br>
              <% }} else { %>
               <td>
               ${company.get(type)} <% } %>
            </td>
          <% } %>
        </tr>
      <% } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(companies)}
</div>

