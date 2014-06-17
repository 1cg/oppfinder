<%@ params(page : long)%>
<% var pager = new model.Pager<java.util.Map<Object,Object>>(model.DataSetEntry.All, 10)
   var r1 = '\\{'
   var r2 = '\\}'
   var r3 = '"'
   if (!pager.validPage(page) && page > 1) {
     page = pager.lastPage()
   } %>
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
          <td> <% if (type == 'Policies') {
            for (var o in (org.json.simple.JSONValue.parse(entry[type] as String) as org.json.simple.JSONArray).map(\ o -> o as String)) { %>
             ${(o.replaceAll(r1,'').replaceAll(r2,'').replaceAll(r3, ''))}<br>
         <% }}  else { %>
             ${entry[type]} <% } %> </td>
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

