uses controller.JobController
uses controller.DataSetController
uses java.lang.Exception

extends sparkgs.SparkGSFile

StaticFiles = '/public'
Layout = view.Layout

// Root
get('/', \-> view.Root.renderToString())

/* Salesforce authenticates then goes back to this Callback URL with a ?code= param. */
get('/_auth', \-> view.jobs.drilldowns.SalesforceUpload.renderToString(Params['code']))

// Jobs
resource("/jobs", new JobController())

// DataSets
resource("/datasets", new DataSetController())

onException(Exception, \ ex, req, resp -> {
  resp.Body = view.ExceptionPage.renderToString(ex)
})