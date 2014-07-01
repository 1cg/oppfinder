uses controller.JobController

extends sparkgs.SparkFile

StaticFiles = '/public'
Layout = view.Layout

// Root
get('/', \-> view.Root.renderToString())

/* Salesforce authenticates then goes back to this Callback URL with a ?code= param. */
get('/_auth', \-> view.SalesforceUpload.renderToString(Params['code']))
get('/jobs/action/start/salesforce_export/:uuid/:code', \-> controller.JobController.startSalesforceAuthJob(Params['uuid'],Params['code']))

// Jobs
resource("/jobs", new JobController())

// DataSets


get('/companies/:page', \-> view.Layout.renderToString(view.Companies.renderToString(Params['page'].toLong())))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(new util.PagerIterable<java.util.Map<Object,Object>>(model.DataSetEntry.MostRecentDataSet,Params['page'].toLong()))})