<%@ params(id : String, companies: util.iterable.PagerIterable<model.Company>)%>
<div>
  <h2 class="page-title">DataSet: ${id}</h2>
  <button class='btn btn-primary pull-right' ic-post-to='/jobs?type=recommend&jobs.RecommendJob[DataSetCollection]=${id}'>Analyze DataSet</button>
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
            <td style='white-space: nowrap'> <% if (type == 'Policies') {
            for (policy in company.Policies){ %>
               ${policy}<br>
              <% }} else { %>
               ${company.get(type)} <% } %>
            </td>
          <% } %>
        </tr>
      <% } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(companies)}
</div>

