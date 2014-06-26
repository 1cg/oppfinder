uses controller.JobController

extends sparkgs.SparkFile

Layout = view.Layout
StaticFiles = '/public'


/* Set TableController() as a resource first so that it will catch all associated
*paths before JobController()
 */
resource("/jobs", new JobController())

/* Getters for job information */
get('/', \-> view.Root.render(Writer))
get('/jobs/table/pager/:type/:page', \-> { Layout = null
  return controller.PagerController.renderPager(Params['type'], Params['page'].toLong())})
get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toLong()))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(controller.PagerController.getCompanyPager(Params['page'].toLong()))})
get('/companies/*', \-> view.Companies.renderToString(1))


/* Start Jobs */
post('/jobs/action/refresh', \-> {Layout = null})
post('/jobs/table/:type/:page', \ -> {Layout = null})

get("*", \-> view.BadPath.renderToString(Request.PathInfo))
