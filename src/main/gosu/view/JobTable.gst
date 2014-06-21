<%@ params(header : String, type : String, pager : model.Pager<jobs.Job>)%>
<div class="page-header">
  <h1>${header}</h1>
</div>
<div ic-src="/jobs/table/${type}/${pager.Current}" ic-poll="10s" ic-transition="none" ic-deps="/jobs/action">
  ${view.JobTableBody.renderToString(type, pager)}
</div>
<button ic-post-to="/jobs/table/${type}/${pager.Current}" class="btn btn-primary btn-md" role="button"><b>Refresh</b></button>
<div ic-src="/jobs/table/pager/${type}/${pager.Current}" ic-poll="4s" ic-transition="none" ic-deps="/jobs/action">
  ${controller.PagerController.renderPager(type,pager.Current)}
</div>