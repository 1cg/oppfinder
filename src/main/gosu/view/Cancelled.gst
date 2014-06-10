<%@ params(page : int)%>
${JobTable.renderToString(jobs.Job.CancelledJobs, "Cancelled Jobs", "cancelled", page)}