<%@ params(pager : util.PagerIterable, URL : String, page : long) %>
<ul class="pagination navbar-right">
  <% if (pager.validPage(2)) { %>
    <li class=${pager.Current == 1 ? "disabled" : ""}>
      <a href=${widgets.PagerWidget.replacePage(URL, "1")}>&#8592; First</a>
    </li>
    <li class=${pager.Current == 1 ? "disabled" : ""}>
      <a href=${widgets.PagerWidget.replacePage(URL, java.lang.Math.max(pager.Current -1, 1) as String)}>
        &#8592; Previous
      </a>
    </li>
    <%
    for (i in -2..2) {
      if (pager.validPage(java.lang.Math.max(pager.Current + i, i + 3))) {%>
      <li class=${java.lang.Math.max(pager.Current + i, i + 3) == pager.Current ? "active" : ""}>
        <a href=${widgets.PagerWidget.replacePage(
                     URL, java.lang.Math.max(pager.Current +i, i + 3) as String)}>
          ${java.lang.Math.max(pager.Current + i,  i + 3)}
        </a>
      </li>
    <% }} %>
    <li class=${pager.Current == pager.Last ? "disabled" : ""}>
      <a href=${widgets.PagerWidget.replacePage(
                        URL, pager.validPage(pager.Current +1) ?
                            (pager.Current + 1) as String :
                            pager.Current as String)}>
        Next &#8594;
      </a>
    </li>
    <li class=${pager.Current == pager.Last ? "disabled" : ""}>
      <a href=${widgets.PagerWidget.replacePage(URL, pager.Last as String)}>
        Last &#8594;
      </a>
    </li>
  <% } %>
</ul>