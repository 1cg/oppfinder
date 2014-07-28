uses controller.JobController
uses controller.DataSetController
uses controller.ResultsController
uses java.lang.Exception
uses controller.UserController
uses auth.AuthFilter

extends sparkgs.SparkGSFile

StaticFiles = '/public'
Layout = view.Layout

resource('/user', new UserController())

using(filter(new AuthFilter())) {
  get('/', \-> view.Root.renderToString(Session['username'] as String))

  // Jobs
  resource("/jobs", new JobController())

  // DataSets
  resource("/datasets", new DataSetController())

  // Results
  resource("/results", new ResultsController())
}

onException(Exception, \ ex, req, resp -> {
  resp.Body = view.ExceptionPage.renderToString(ex)
})
