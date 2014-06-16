<%@ params(page : long)%>
<% var pager = new model.Pager<java.util.Map<Object,Object>>(model.DataSetEntry.All, 10) %>

<table class="table">
  <thead>
    <tr>
      <% for (type in model.Company.CompanyDataTypes) { %>
        <th> ${type} </th>
      <% } %>
    </tr>
  </thead>
  <tbody>
    <% for (entry in pager.getPage(page)) { %>
      <tr>
        <% for (type in model.Company.CompanyDataTypes) { %>
          <td> ${entry[type]} </td>
        <% } %>
      </tr>
    <% } %>
  </tbody>
</table>
<ul class="pagination navbar-right">
  <li class=${pager.checkStatus(page -1)}>
    <a href="/companies/${java.lang.Math.max(pager.Current -1, 1)}">&laquo;</a>
  </li>
  <% for (i in -2..2) { %>
  <li class=${pager.checkStatus(java.lang.Math.max(page + i, i + 3))}>
    <a href="/companies/${java.lang.Math.max(pager.Current +i, i + 3)}">${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
  </li>
  <% } %>
  <li class=${pager.checkStatus(page +1)}>
    <a href="/companies/${pager.Current +1}">&raquo;</a>
  </li>
</ul>

