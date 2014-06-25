<%@ params(header : String, type : String, pager : model.Pager<jobs.Job>)%>
<div class="page-header">
  <h1>${header}</h1>
</div>
<h3 class="navbar-left">Filter by job status: </h3>
<div class="btn-group navbar-left" style='padding-left:10px;padding-top:15px'>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    Job Status <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a ic-get-from="/jobs/table/all/${pager.Current}" ic-target="#wrapper">All</a></li>
    <li><a ic-get-from="/jobs/table/running/${pager.Current}" ic-target="#wrapper">Running</a></li>
    <li><a ic-get-from="/jobs/table/complete/${pager.Current}" ic-target="#wrapper">Completed</a></li>
    <li><a ic-get-from="/jobs/table/cancelled/${pager.Current}" ic-target="#wrapper">Cancelled</a></li>
    <li><a ic-get-from="/jobs/table/failed/${pager.Current}" ic-target="#wrapper">Failed</a></li>
  </ul>
</div>
<br><br><hr>
<div id='wrapper'>
  ${view.JobTableBody.renderToString(type, pager)}
</div>