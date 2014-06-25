
extends sparkgs.SparkFile

Layout = view.Layout
StaticFiles = '/public'

/* Getters for job information */
get('/', \-> view.Root.renderToString())
get('/jobs/home/:page', \-> {
  Layout = null
  controller.TableController.getRunningTable(Params['page'].toLong())})
get('/jobs/running/:page', \-> controller.TableController.getRunningTable(Params['page'].toLong()))
get('/jobs/all/:page', \-> controller.TableController.getAllTable(Params['page'].toLong()))
get('/jobs/complete/:page', \-> controller.TableController.getCompleteTable(Params['page'].toLong()))
get('/jobs/cancelled/:page', \-> controller.TableController.getCancelledTable(Params['page'].toLong()))
get('/jobs/failed/:page', \-> controller.TableController.getFailedTable(Params['page'].toLong()))
get('/jobs/generate/percent_done', \-> {
  Layout = null
  return controller.JobController.LocalGenerateProgress})
get('/jobs/generate/complete', \-> {
  Layout = null
  return controller.JobController.LocalGenerateComplete})
get('/jobs/:id/percent_done', \-> {
  Layout = null
  return controller.JobController.getUUIDProgress(Params['id'])
})
get('/jobs/:id/elapsed_time', \-> {
  Layout = null
  return controller.JobController.getUUIDElapsedTime(Params['id'])
})
get('/jobs/:id/info', \-> controller.JobController.renderJobInfo(Params['id']))
get('/jobs/:id/status_feed', \-> {Layout = null
  return controller.JobController.getStatusFeed(Params['id'])})
get('/jobs/table/all/:page', \-> { Layout = null
                    return controller.TableController.getAllTableBody(Params['page'].toLong())})
get('/jobs/table/running/:page', \-> { Layout = null
                    return controller.TableController.getRunningTableBody(Params['page'].toLong())})
get('/jobs/table/complete/:page', \-> { Layout = null
                    return controller.TableController.getCompleteTableBody(Params['page'].toLong())})
get('/jobs/table/failed/:page', \-> { Layout = null
                    return controller.TableController.getFailedTableBody(Params['page'].toLong())})
get('/jobs/table/cancelled/:page', \-> { Layout = null
                    return controller.TableController.getCancelledTableBody(Params['page'].toLong())})
get('/jobs/table/pager/:type/:page', \-> { Layout = null
  return controller.PagerController.renderPager(Params['type'], Params['page'].toLong())})
get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toLong()))
get('/jobs/upload', \-> view.Companies.renderToString(1))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(controller.PagerController.getCompanyPager(Params['page'].toLong()))})
get('/companies/*', \-> view.Companies.renderToString(1))


/* Start Jobs */
post('/jobs/action/start/test', \-> controller.JobController.startTestJob())
post('/jobs/action/start/generate', \-> controller.JobController.startGenerateJob(Request.Body.toString()))
post('/jobs/action/start/upload', \-> controller.JobController.startUploadJob(Request.Body))
post('/jobs/action/start/recommend', \-> controller.JobController.startRecommendJob(Request.Body.toString().split("=")[1]))
post('/jobs/action/delete/:id', \-> controller.JobController.deleteJob(Params['id']))
post('/jobs/action/state/:id/cancel', \-> controller.JobController.cancelJob(Params['id']))
post('/jobs/action/state/:id/reset', \-> controller.JobController.resetJob(Params['id']))
post('/jobs/action/refresh', \-> {Layout = null})
post('/jobs/table/:type/:page', \ -> {Layout = null})

get("*", \-> view.BadPath.renderToString(Request.PathInfo))
