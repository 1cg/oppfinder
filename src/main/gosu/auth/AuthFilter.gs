package auth

uses sparkgs.ISparkGSFilter
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSRequest
uses org.apache.shiro.subject.Subject

class AuthFilter implements ISparkGSFilter {
  override function before(req: SparkGSRequest, resp: SparkGSResponse) {
    var currentUser = req.Session["currentUser"] as Subject
    if(currentUser == null) {
      resp.redirect("/user")
    } else if (!currentUser.Authenticated) {
      req.Session.remove("currentUser")
      req.Headers['X-IC-Redirect'] = "/"
      resp.redirect("/user")
    }
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
  }
}