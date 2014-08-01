<%@ params(type : String, pager : model.database.iterable.PagerIterable<jobs.Job>)%>
<div>
  <form>
  <div class="btn-group status-select pull-right">
    <button type="button" class="btn btn-primary pull-right dropdown-toggle" data-toggle="dropdown">
      Bulk Action <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li><a ic-post-to="/jobs/deletebulk" ic-include="#jobcheckbox">Delete</a></li>
      <li><a ic-post-to="/jobs/cancelbulk" ic-include="#jobcheckbox">Cancel</a></li>
      <li><a ic-post-to="/jobs/resetbulk" ic-include="#jobcheckbox">Reset</a></li>
    </ul>
  </div>
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
  <div class="btn-group status-select pull-right">
  <a href="/jobs" class="btn btn-primary pull-right"><font size="4"><span class="fa fa-refresh"></span></font></a>
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
  </form>
</div>
