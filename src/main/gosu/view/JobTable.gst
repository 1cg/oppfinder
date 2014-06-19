<%@ params(header : String, type : String, page : long)%>
<div class="page-header">
  <h1>${header}</h1>
</div>
<div ic-src="/jobs/table/${type}/${page}" ic-poll="10s" ic-transition="none" ic-deps="/jobs/action">
  ${view.JobTableBody.renderToString(type, page, controller.PagerController.getPager(type,page))}
</div>
<div ic-src="/jobs/table/pager/${type}/${page}" ic-poll="4s" ic-transition="none" ic-deps="/jobs/action">
  ${controller.PagerController.renderPager(type,page)}
</div>