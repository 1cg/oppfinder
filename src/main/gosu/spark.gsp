extends sparkgs.SparkFile

Layout = view.Layout

/* Getters for job information */
get('/', \-> view.Root.renderToString() )
get('/jobs/running/:page', \-> view.Running.renderToString(Params['page'].toInt()))
get('/jobs/complete/:page', \-> view.Complete.renderToString(Params['page'].toInt()))
get('/jobs/cancelled/:page', \-> view.Cancelled.renderToString(Params['page'].toInt()))
get('/jobs/:id/percent_done', \-> {
  Layout = null
  return jobs.Job.getUUIDProgress(Params['id'])
})
get('/jobs/:id/elapsed_time', \-> {
  Layout = null
  return jobs.Job.getUUIDElapsedTime(Params['id'])
})
get('/jobs/:id/info', \-> jobs.Job.renderToString(Params['id']))
get('/jobs/table/:type/:page', \-> { Layout = null
                    return view.JobTableBody.renderToString(Params['type'], Params['page'].toInt())})
get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toInt()))
get('/jobs/upload', \-> view.Companies.renderToString(1))
get('/companies/*', \-> view.Companies.renderToString(1))

/* Start Jobs */
post('/jobs/action/start/test', \-> controller.JobController.startTestJob())
post('/jobs/action/start/generate', \-> controller.JobController.startGenerateJob())
post('/jobs/action/start/upload', \-> controller.JobController.startUploadJob(Request.Body))
post('/jobs/action/start/recommend', \-> controller.JobController.startRecommendJob())
post('/jobs/action/state/:id/cancel', \-> jobs.Job.cancel(Params['id']))
post('/jobs/action/state/:id/reset', \-> jobs.Job.reset(Params['id']))
post('/jobs/table/:type/:page', \ -> {Layout = null})

get("*", \-> view.BadPath.renderToString())
