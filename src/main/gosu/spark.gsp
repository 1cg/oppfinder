extends sparkgs.SparkFile

Layout = view.Layout

/* Getters for job information */
get('/', \-> view.Root.renderToString() )
get('/jobs/running/:page', \-> controller.TableController.getRunningTable(Params['page'].toLong()))
get('/jobs/complete/:page', \-> controller.TableController.getCompleteTable(Params['page'].toLong()))
get('/jobs/cancelled/:page', \-> controller.TableController.getCancelledTable(Params['page'].toLong()))
get('/jobs/:id/percent_done', \-> {
  Layout = null
  return controller.JobController.getUUIDProgress(Params['id'])
})
get('/jobs/:id/elapsed_time', \-> {
  Layout = null
  return controller.JobController.getUUIDElapsedTime(Params['id'])
})
get('/jobs/:id/info', \-> jobs.Job.renderToString(Params['id']))
get('/jobs/table/:type/:page', \-> { Layout = null
                    return view.JobTableBody.renderToString(Params['type'], Params['page'].toLong())})
get('/jobs/table/pager/:type/:page', \-> { Layout = null
  return controller.PagerController.renderPager(Params['type'], Params['page'].toLong())})
get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toLong()))
get('/jobs/upload', \-> view.Companies.renderToString(1))
get('/companies/table/:page', \-> { Layout = null
    return view.CompanyTable.renderToString(Params['page'].toLong())})
get('/companies/*', \-> view.Companies.renderToString(1))

/* Start Jobs */
post('/jobs/action/start/test', \-> controller.JobController.startTestJob())
post('/jobs/action/start/generate', \-> controller.JobController.startGenerateJob())
post('/jobs/action/start/generateTest/:testVar', \-> controller.JobController.startGenerateTestJob(Params['testVar']))
post('/jobs/action/start/upload', \-> controller.JobController.startUploadJob(Request.Body))
post('/jobs/action/start/recommend', \-> controller.JobController.startRecommendJob())
post('/jobs/action/deleteCancelled', \-> controller.JobController.deleteJobs('Cancelled'))
post('/jobs/action/deleteCompleted', \-> controller.JobController.deleteJobs('Complete'))
post('/jobs/action/state/:id/cancel', \-> controller.JobController.cancelJob(Params['id']))
post('/jobs/action/state/:id/reset', \-> controller.JobController.resetJob(Params['id']))
post('/jobs/table/:type/:page', \ -> {Layout = null})

get("*", \-> view.BadPath.renderToString())
