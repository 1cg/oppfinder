<%@ params(page : int)%>
${JobTable.renderToString(jobs.Job.CompleteJobs, "Completed Jobs", "complete", page)}