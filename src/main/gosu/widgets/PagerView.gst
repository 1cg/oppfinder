<%@ params(pager : model.Pager, path : String, type : String = "all") %>
<div class="navbar-right" ic-src="/jobs/table/pager/${type}/${pager.Current}" ic-poll="3s" ic-transition="none" ic-deps="/jobs/action">
  <ul class="pagination navbar-right">
    <% if (pager.validPage(2)) { %>
      <li class=${pager.checkStatus(pager.Current -1)}>
        <a href=${path+"1"}>&#8592; First</a>
      </li>
      <li class=${pager.checkStatus(pager.Current -1)}>
        <a href=${path+java.lang.Math.max(pager.Current -1, 1)}>&#8592; Previous</a>
      </li>
      <%
      for (i in -2..2) {
        if (pager.validPage(java.lang.Math.max(pager.Current + i, i + 3))) {%>
        <li class=${pager.checkStatus(java.lang.Math.max(pager.Current + i, i + 3))}>
          <a href=${path+java.lang.Math.max(pager.Current +i, i + 3)}>${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
        </li>
      <% }} %>
      <li class=${pager.checkStatus(pager.Current +1)}>
        <a href=${path+(pager.validPage(pager.Current +1) ? pager.Current + 1 : pager.Current)}>Next &#8594;</a>
      </li>
      <li class=${pager.checkStatus(pager.lastPage())}>
        <a href=${path+pager.lastPage()}>Last &#8594;</a>
      </li>
    <% } %>
  </ul>
</div>