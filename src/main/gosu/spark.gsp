uses controller.JobController
uses controller.DataSetController
uses controller.ResultsController
uses java.lang.Exception
uses controller.UserController
uses org.apache.shiro.SecurityUtils
uses model.database.Database
uses org.apache.shiro.mgt.DefaultSecurityManager
uses auth.MongoUserPasswordRealm
uses org.apache.shiro.mgt.SecurityManager
uses auth.AuthFilter

extends sparkgs.SparkGSFile

StaticFiles = '/public'
Layout = view.Layout

//using(httpsFilter()) {
var _collection = Database.INSTANCE.getCollection("MONGO_USER_AUTHENTICATION")
print("spark collection name: "+_collection.FullName)
var _realm = new MongoUserPasswordRealm(_collection)
var _securityManager : SecurityManager = new DefaultSecurityManager(_realm)
SecurityUtils.setSecurityManager(_securityManager) // I know this much is good - same secMan ubiquitously

var _subject = SecurityUtils.getSubject()

// Root
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
