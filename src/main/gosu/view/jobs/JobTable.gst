<%@ params(type : String, pager : util.PagerIterable<jobs.Job>)%>

<div>
  <h2 class="page-title">Jobs</h2>
  <a href="/datasets/new" class="btn btn-primary pull-right">Start Job</a>
</div>

<h3 class="navbar-left">Filter by job status: </h3>
<div class="btn-group navbar-left" style='padding-left:10px;padding-top:15px'>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    Job Status <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a ic-get-from="/jobs/table?status=all&page=${pager.Current}" ic-target="#wrapper">All</a></li>
    <li><a ic-get-from="/jobs/table?status=running&page=${pager.Current}" ic-target="#wrapper">Running</a></li>
    <li><a ic-get-from="/jobs/table?status=completed&page=${pager.Current}" ic-target="#wrapper">Completed</a></li>
    <li><a ic-get-from="/jobs/table?status=cancelled&page=${pager.Current}" ic-target="#wrapper">Cancelled</a></li>
    <li><a ic-get-from="/jobs/table?status=failed&page=${pager.Current}" ic-target="#wrapper">Failed</a></li>
  </ul>
</div>
<br><br><hr>
<div id='wrapper'>
  ${view.jobs.JobTableBody.renderToString(type, pager, true)}
</div>