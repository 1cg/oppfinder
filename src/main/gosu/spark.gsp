uses controller.JobController
uses controller.DataSetController
uses controller.ResultsController
uses java.lang.Exception
uses controller.UserController
uses org.apache.shiro.SecurityUtils
uses model.database.Database
uses org.apache.shiro.mgt.DefaultSecurityManager
uses auth.MongoUserPasswordRealm
uses auth.AuthFilter

extends sparkgs.SparkGSFile

StaticFiles = '/public'
Layout = view.Layout

var _realm = new MongoUserPasswordRealm(Database.INSTANCE.getCollection("MONGO_USER_AUTHENTICATION"))
SecurityUtils.setSecurityManager(new DefaultSecurityManager(_realm))
var _subject = SecurityUtils.getSubject()

resource('/user', new UserController(_realm, _subject))

using(filter(new AuthFilter())) {
  get('/', \-> view.Root.renderToString())

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
