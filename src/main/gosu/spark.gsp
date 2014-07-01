uses controller.JobController
uses controller.DataSetController

extends sparkgs.SparkFile

StaticFiles = '/public'
Layout = view.Layout

// Root
get('/', \-> view.Root.renderToString())

/* Salesforce authenticates then goes back to this Callback URL with a ?code= param. */
get('/_auth', \-> view.SalesforceUpload.renderToString(Params['code']))

// Jobs
resource("/jobs", new JobController())

// DataSets
resource("/dataset", new DataSetController())

get('/companies/:page', \-> view.Companies.renderToString(Params['page'].toLong()))
get('/companies/table/:page', \-> {
  Layout = null
  return view.CompanyTable.renderToString(model.DataSetEntry.MostRecentDataSet?.paginate(Params['page'] as String))})
