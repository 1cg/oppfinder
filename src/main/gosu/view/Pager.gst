<%@ params(type : String, page : long) %>
<% var pager : model.Pager
    if (type == "complete") {
      pager = new model.Pager(jobs.Job.CompleteJobs,10)
    } else if (type == "running") {
      pager = new model.Pager(jobs.Job.ActiveJobs,10)
    } else {
      pager = new model.Pager(jobs.Job.CancelledJobs,10)
    }
    if (!pager.validPage(page)) {
      page = pager.lastPage()
    }
    pager.getPage(page)
%>
<ul class="pagination navbar-right">
  <li><button ic-post-to="/jobs/table/${type}/${page}" class="btn btn-info btn-md" role="button"><b>Refresh</b></button></li>
  <% if (pager.validPage(2)) { %>
    <li class=${pager.checkStatus(page -1)}>
      <a href="/jobs/${type}/${java.lang.Math.max(pager.Current -1, 1)}">&laquo;</a>
    </li>
    <%
    for (i in -2..2) {
      if (pager.validPage(java.lang.Math.max(page + i, i + 3))) {%>
      <li class=${pager.checkStatus(java.lang.Math.max(page + i, i + 3))}>
        <a href="/jobs/${type}/${java.lang.Math.max(pager.Current +i, i + 3)}">${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
      </li>
    <% }} %>
    <li class=${pager.checkStatus(page +1)}>
      <a href="/jobs/${type}/${pager.validPage(pager.Current +1) ? pager.Current + 1 : pager.Current}">&raquo;</a>
    </li>
  <% } %>
</ul>