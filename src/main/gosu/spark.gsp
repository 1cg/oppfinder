extends sparkgs.SparkFile

Layout = view.Layout

/* Getters for job information */
get('/', \-> view.Root.renderToString() )
get('/jobs/running/:page', \-> view.Running.renderToString(Params['page'].toInt()))
get('/jobs/complete/:page', \-> view.Complete.renderToString(Params['page'].toInt()))
get('/jobs/cancelled/:page', \-> view.Cancelled.renderToString(Params['page'].toInt()))
get('/jobs/:id/percent_done', \-> jobs.Job.getUUIDProgress(Params['id']))
get('/jobs/:id/info', \-> jobs.Job.renderToString(Params['id']))
get('/jobs/table/:type/:page', \-> view.JobTableBody.renderToString(Params['type'], Params['page'].toInt()))

/* Start Jobs */
post('/jobs/test', \-> controller.JobController.startTestJob())
post('/jobs/generate', \-> controller.JobController.startGenerateJob())
post('/jobs/:id/cancel', \-> jobs.Job.cancel(Params['id']))
post('/jobs/:id/reset', \-> jobs.Job.reset(Params['id']))
post('/jobs/table/:type/:page', \ -> "Refresh")

get('/companies', \-> view.Companies.renderToString() )
get("*", \-> view.BadPath.renderToString())
