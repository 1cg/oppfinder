uses controller.JobController
uses controller.DataSetController
uses controller.ResultsController
uses java.lang.Exception

extends sparkgs.SparkGSFile

StaticFiles = '/public'
Layout = view.Layout

// Root
get('/', \-> view.Root.renderToString())

// Jobs
resource("/jobs", new JobController())

// DataSets
resource("/datasets", new DataSetController())

// ResultInfo
resource("/results", new ResultsController())

onException(Exception, \ ex, req, resp -> {
  resp.Body = view.ExceptionPage.renderToString(ex)
})