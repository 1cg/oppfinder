package auth

uses sparkgs.ISparkGSFilter
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSRequest
uses org.apache.shiro.SecurityUtils

class AuthFilter implements ISparkGSFilter {
  override function before(req: SparkGSRequest, resp: SparkGSResponse) {

   if(!SecurityUtils.getSubject().Authenticated) {
      resp.redirect("/user")
   }
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
  }
}