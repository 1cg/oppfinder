uses controller.JobController

extends sparkgs.SparkFile

StaticFiles = '/public'

Layout = view.Layout
//get("/foo", \-> "foo")
//get("/bar", \-> raw("bar"))

/* Salesforce authenticates then goes back to this Callback URL with a ?code= param. */
get('/_auth', \-> view.SalesforceUpload.renderToString(Params['code']))
get('/jobs/action/start/salesforce_export/:uuid/:code', \-> {
  controller.JobController.startSalesforceAuthJob(Params['uuid'],Params['code'])
  view.Root.render(Writer)
})

/* Set TableController() as a resource first so that it will catch all associated
*paths before JobController()
 */
resource("/jobs", new JobController())

/* Getters for job information */
get('/', \-> {Layout = view.Layout
              view.Root.render(Writer) })
get('/jobs/table/pager/:type/:page', \-> { Layout = null
  return controller.PagerController.renderPager(Params['type'],controller.PagerController.getPager(Params['type'], Params['page'].toLong()))})
get('/companies/:page', \-> view.Layout.renderToString(view.Companies.renderToString(Params['page'].toLong())))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(controller.PagerController.getCompanyPager(Params['page'].toLong()))})


get("*", \-> view.BadPath.renderToString(Request.PathInfo))
