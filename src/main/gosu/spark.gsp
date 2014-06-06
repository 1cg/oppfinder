uses view.Companies

extends sparkgs.SparkFile

Layout = view.Layout

/* Getters for job information */
get('/', \-> view.Root.renderToString() )
get('/jobs/running', \-> view.Running.renderToString())
get('/jobs/complete', \-> view.Complete.renderToString())
get('/jobs/:id/percent_done', \-> jobs.Job.getUUIDProgress(Params['id']))

/* Start Jobs */
post('/jobs/test', \-> controller.JobController.startTestJob())
post('/jobs/generate', \-> controller.JobController.startGenerateJob())
post('/jobs/:id/cancel', \-> controller.JobController.cancelJob(Params['id']))

get('/companies', \-> view.Companies.renderToString() )
