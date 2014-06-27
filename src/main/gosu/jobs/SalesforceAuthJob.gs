package jobs

uses java.util.Map
uses model.DataSet
uses org.apache.commons.httpclient.methods.PostMethod
uses org.apache.commons.httpclient.HttpClient
uses org.json.simple.JSONObject
uses org.json.simple.JSONValue

uses org.apache.commons.httpclient.NameValuePair
uses org.apache.commons.httpclient.methods.StringRequestEntity

class SalesforceAuthJob extends Job {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct(recommendUUID : String, authCode : String) {
    super()
    update({'AnalysisToUpload' -> recommendUUID})
    update({'AuthCode' -> authCode})
  }

  override function executeJob() {
    checkCancellation()

    this.StatusFeed= "Connecting to Salesforce..."

    /* This code receives the the authorization code from the authorization endpoint, then requests for the access
     * token with which to access protected salesforce resources. */

    /*
     * You need to use the correct Salesforce OAuth endpoint when issuing authentication requests in your application.
     * The primary OAuth endpoints are:
     * For authorization: https://login.salesforce.com/services/oauth2/authorize
     * For token requests: https://login.salesforce.com/services/oauth2/token
     * For revoking OAuth tokens: https://login.salesforce.com/services/oauth2/revoke
     */


    // OAUTH - Receiving the access token (STEP 4)
    var clientId = "3MVG9xOCXq4ID1uHgL9H.cY5bCyugh.IQXPoeCKgVGLWwC3NvV3Zqj08_KIEEViJmJ.i7hDLkO89Q20ykTyu_"
    var clientSecret = "2369090302549152630"
    var code = search('AuthCode') as String

    this.StatusFeed = "Auth Code: "+code

    var httpClient = new HttpClient();
    var post = new PostMethod("https://login.salesforce.com/services/oauth2/token");
    post.addParameter("grant_type","authorization_code");
    /** For session ID instead of OAuth 2.0, use "grant_type", "password" **/
    post.addParameter("client_id",clientId);
    post.addParameter("client_secret",clientSecret);
    post.addParameter("redirect_uri", "https://gosuroku.herokuapp.com/_auth");
    post.addParameter("code",code);
    httpClient.executeMethod(post)

    this.StatusFeed = "Managed to execute authorization post... Starting Opportunity request!!!"

    /* Receive response with access token. Access token must be used for all following requests */
    var authResponse = post.getResponseBodyAsString()

    this.StatusFeed = "ResponseBody (provides Access Token and Refresh Token): "+authResponse

    var json = JSONValue.parse(authResponse) as JSONObject

    this.StatusFeed = "ResponseBody (JSONized): "+json.toString()
    var accessToken = json.get("access_token") as String
    var issuedAt = json.get("issued_at") as String
    var instanceUrl = json.get("instance_url") as String

    this.StatusFeed = "access token = "+accessToken
    this.StatusFeed = "issued at = "+issuedAt
    this.StatusFeed = "instance url = "+instanceUrl

///////// WHAT THE FUUUUUUUUUUUU HOW ABOUT WE MAKE AN OPPORTUNITY PLZZZ

    var opp = new JSONObject()
    opp.put("AccountId", "001o0000003Jdkf")
    opp.put("Name","Cool Company Bro")
    opp.put("StageName","Qualification")
    opp.put("Probability", "10.0")
    opp.put("CloseDate","2014-07-07")

    var pm = new PostMethod(instanceUrl+"/services/data/v31.0/sobjects/Opportunity")

    pm.setRequestHeader("Authorization", "OAuth "+accessToken)
    pm.setRequestEntity(new StringRequestEntity(opp.toString(), "application/json", null))

    httpClient.executeMethod(pm)
/*
    pm.setRequestHeader("Authorization", "OAuth "+accessToken)
    pm.setRequestHeader("Content-Type", "application/json")
    pm.setRequestHeader("X-HTTP-Method-Override", "PUT")
    var company = "CoolCompany"
    var policy = "CoolPolicy"
    var value = "4.0"
    var nameValuePair = new NameValuePair()
    nameValuePair.setName("data")
    nameValuePair.setValue('{"AccountId":"001o0000003Jdkf","Name":"'+company+', '+policy+'", "StageName":"Qualification", "Probability":"10.0", "CloseDate":"2014-07-07"}')
    var nvpairList = new NameValuePair[1]
    nvpairList[0] = nameValuePair

    pm.setRequestBody(nvpairList)
*/
  //  this.StatusFeed = "About to execute Post method: "+pm.toString()
  //  this.StatusFeed = "pm headers"+(pm.RequestHeaders.toList().toString())
  //  this.StatusFeed = "pm parameters: "+(pm.Parameters.toList().toString())

    print("yo")

   // httpClient.executeMethod(pm)

    this.StatusFeed = "RESPONSE: " + pm.getResponseBodyAsString()

    this.StatusFeed = "Finished uploading to Salesforce"

    /* API ACCESS */
    /*
    var metrics = new MetricRegistry()
    var pool = new RestConnectionPoolImpl<String>(metrics) // from the 3rd party api
    var orgId = "00Do0000000J6TA"
    var host = "https://gosuroku.herokuapp.com/_auth"
    pool.configureOrg(orgId, host, accessToken)
    var connection = pool.getRestConnection(orgId)
*/
    /*if(false) {
      var recommendations = new DataSet('Results:'+search('AnalysisToUpload') as String).find()
      for(result in recommendations) {
        var company1 = result.get('Company') as String
        var policy1 = result.get('Policy') as String
        var value1 = result.get('Value') as String
        var nameValuePair1 = new NameValuePair()
        nameValuePair.setName("data")
        nameValuePair.setValue('{"AccountId":"001o0000003Jdkf","Name":"'+company1+', '+policy1+'", "StageName":"Prospecting", "Probability":"'+value1+'"}')
        pm.addParameter(nameValuePair)
        httpClient.executeMethod(pm)
      }
      }
*/

    this.StatusFeed = "Done"
    this.Progress = 100

  }

  override function reset() {
  }

  override function renderToString(): String {
    return "Salesforce Job"
  }
}