uses controller.JobController

extends sparkgs.SparkFile

StaticFiles = '/public'

/* Salesforce authenticates then goes back to this Callback URL with a ?code= param. */
get('/_auth', \-> view.SalesforceUpload.renderToString(Params['code']))
get('/jobs/action/start/salesforce_export/:uuid/:code', \-> controller.JobController.startSalesforceAuthJob(Params['uuid'],Params['code']))


/* Set TableController() as a resource first so that it will catch all associated
*paths before JobController()
 */
resource("/jobs", new JobController())

/* Getters for job information */
get('/', \-> {Layout = view.Layout
              view.Root.render(Writer) })
get('/companies/:page', \-> view.Layout.renderToString(view.Companies.renderToString(Params['page'].toLong())))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(new util.PagerIterable<java.util.Map<Object,Object>>(model.DataSetEntry.MostRecentDataSet,Params['page'].toLong()))})


get("*", \-> view.BadPath.renderToString(Request.PathInfo))
