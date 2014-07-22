package auth

uses sparkgs.ISparkGSFilter
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSRequest
uses org.apache.shiro.SecurityUtils
uses spark.Response

class AuthFilter implements ISparkGSFilter {
  override function before(req: SparkGSRequest, resp: SparkGSResponse) {

   if(!SecurityUtils.getSubject().Authenticated) {
      print("not authenticated")
      print(req)
      print(resp)

    //  resp.redirect("/user") // Null pointer exception??
      print("yo")
   }
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
    print("after!")
    //resp.redirect("/user")

  }
}