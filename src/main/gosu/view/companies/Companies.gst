<%@ params(id : String, pager: util.iterable.PagerIterable<java.util.Map<Object,Object>>)%>
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

