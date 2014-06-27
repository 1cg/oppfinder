uses controller.JobController

extends sparkgs.SparkFile

//Layout = view.Layout
StaticFiles = '/public'

resource("/jobs", new JobController())

/* Getters for job information */
get('/', \-> {Layout = view.Layout
              view.Root.render(Writer) })
get('/jobs/table/pager/:type/:page', \-> { Layout = null
  return controller.PagerController.renderPager(Params['type'],controller.PagerController.getPager(Params['type'], Params['page'].toLong()))})
get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toLong()))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(controller.PagerController.getCompanyPager(Params['page'].toLong()))})
get('/companies/*', \-> view.Companies.renderToString(1))


/* Start Jobs */
post('/jobs/table/:type/:page', \ -> {Layout = null})

get("*", \-> view.BadPath.renderToString(Request.PathInfo))
