<%@ params(page : long)%>
${JobTable.renderToString("Cancelled Jobs", "cancelled", page)}

<button ic-post-to="/jobs/action/deleteCancelled" ic-transition="none" class="btn btn-info btn-md" role="button">
  Delete
</button>
