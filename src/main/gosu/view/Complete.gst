<%@ params(page : long)%>
${JobTable.renderToString("Completed Jobs", "complete", page)}

<button ic-post-to="/jobs/action/deleteCompleted" ic-transition="none" class="btn btn-info btn-md" role="button">
  Delete
</button>