<%@ params(type : String, pager : util.iterable.PagerIterable<jobs.Job>)%>

<div>
  <div class="btn-group status-select pull-right">
    <button type="button" class="btn btn-primary pull-right dropdown-toggle" data-toggle="dropdown">
      Start Job <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li><a href="/results/new">New Analysis</a></li>
      <li><a href="/datasets/new">New Dataset</a></li>
      <li><a href="/results/push">New Salesforce Push</a></li>
      <li><a ic-post-to="/jobs?type=test">New Test Job</a></li>
    </ul>
  </div>
  <h2 class="page-title">Jobs</h2>
  <div class="btn-group status-select">
    <button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">
      ${type.capitalize()} <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li><a href="/jobs?status=all&page=${pager.Current}">All</a></li>
      <li><a href="/jobs?status=running&page=${pager.Current}">Running</a></li>
      <li><a href="/jobs?status=completed&page=${pager.Current}">Completed</a></li>
      <li><a href="/jobs?status=cancelled&page=${pager.Current}">Cancelled</a></li>
      <li><a href="/jobs?status=failed&page=${pager.Current}">Failed</a></li>
    </ul>
  </div>
</div>

<div id='wrapper'>
  ${view.jobs.JobTableBody.renderToString(type, pager)}
</div>