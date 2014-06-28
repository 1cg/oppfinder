<%@ params(pager : util.PagerIterable, path : String, type : String = "all") %>
<ul class="pagination navbar-right">
  <% if (pager.validPage(2)) { %>
    <li class=${pager.Current == 1 ? "disabled" : ""}>
      <a href=${path+"1"}>&#8592; First</a>
    </li>
    <li class=${pager.Current == 1 ? "disabled" : ""}>
      <a href=${path+java.lang.Math.max(pager.Current -1, 1)}>&#8592; Previous</a>
    </li>
    <%
    for (i in -2..2) {
      if (pager.validPage(java.lang.Math.max(pager.Current + i, i + 3))) {%>
      <li class=${java.lang.Math.max(pager.Current + i, i + 3) == pager.Current ? "active" : ""}>
        <a href=${path+java.lang.Math.max(pager.Current +i, i + 3)}>${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
      </li>
    <% }} %>
    <li class=${pager.Current == pager.Last ? "disabled" : ""}>
      <a href=${path+(pager.validPage(pager.Current +1) ? pager.Current + 1 : pager.Current)}>Next &#8594;</a>
    </li>
    <li class=${pager.Current == pager.Last ? "disabled" : ""}>
      <a href=${path+pager.Last}>Last &#8594;</a>
    </li>
  <% } %>
</ul>