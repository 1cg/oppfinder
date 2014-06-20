<%@ params(pager : model.Pager, path : String) %>
<ul class="pagination navbar-right">
  <% if (pager.validPage(2)) { %>
    <li class=${pager.checkStatus(pager.Current -1)}>
      <a href=${path+java.lang.Math.max(pager.Current -1, 1)}>&laquo;</a>
    </li>
    <%
    for (i in -2..2) {
      if (pager.validPage(java.lang.Math.max(pager.Current + i, i + 3))) {%>
      <li class=${pager.checkStatus(java.lang.Math.max(pager.Current + i, i + 3))}>
        <a href=${path+java.lang.Math.max(pager.Current +i, i + 3)}>${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
      </li>
    <% }} %>
    <li class=${pager.checkStatus(pager.Current +1)}>
      <a href=${path+(pager.validPage(pager.Current +1) ? pager.Current + 1 : pager.Current)}>&raquo;</a>
    </li>
  <% } %>
</ul>