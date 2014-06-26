package jobs

uses java.util.Map
uses model.DataSet
uses org.apache.commons.httpclient.methods.PostMethod
uses org.apache.commons.httpclient.HttpClient
uses org.json.simple.JSONObject
uses org.json.simple.JSONValue

uses org.apache.commons.httpclient.NameValuePair

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

    // OAUTH - Receiving the access token
    var clientId = "3MVG9xOCXq4ID1uHgL9H.cY5bCyugh.IQXPoeCKgVGLWwC3NvV3Zqj08_KIEEViJmJ.i7hDLkO89Q20ykTyu_"
    var clientSecret = "2369090302549152630"
    var redirectUri = "https://gosuroku.herokuapp.com/_auth_access_token" //may have to change this for token as opposed to code
    var environment = "https://login.salesforce.com/services/oauth2/token"
    var code = search('AuthCode') as String

    var httpClient = new HttpClient();
    var post = new PostMethod(environment);
    post.addParameter("grant_type","authorization_code");
    /** For session ID instead of OAuth 2.0, use "grant_type", "password" **/
    post.addParameter("client_id",clientId);
    post.addParameter("client_secret",clientSecret);
    post.addParameter("redirect_uri",redirectUri);
    post.addParameter("code",code);
    httpClient.executeMethod(post)

    /* Receive response with access token. Access token must be used for all following requests */
    var responseBody = post.getResponseBodyAsString()
    var json = JSONValue.parse(responseBody) as JSONObject
    var accessToken = json.get("access_token") as String
    var issuedAt = json.get("issued_at") as String
    var instanceUrl = json.get("instance_url") as String

    var pm = new PostMethod(instanceUrl+"/services/data/v26.0/sobjects/Opportunity")
    pm.setRequestHeader("Authorization", "Bearer "+accessToken)
    pm.setRequestHeader("Content-Type", "application/json")
    pm.setRequestHeader("X-HTTP-Method-Override", "PUT")



    /* API ACCESS */
    /*
    var metrics = new MetricRegistry()
    var pool = new RestConnectionPoolImpl<String>(metrics) // from the 3rd party api
    var orgId = "00Do0000000J6TA"
    var host = "https://gosuroku.herokuapp.com/_auth"
    pool.configureOrg(orgId, host, accessToken)
    var connection = pool.getRestConnection(orgId)
*/

    this.StatusFeed = "Started uploading to Salesforce"

    if(search('AnalysisToUpload') as String == "0000") {
      var company = "CoolCompany"
      var policy = "CoolPolicy"
      var value = "4.0"
      var nameValuePair = new NameValuePair()
      nameValuePair.setName("data")
      nameValuePair.setValue('{"AccountId":"001o0000003Jdkf","Name":"'+company+', '+policy+'", "StageName":"Prospecting", "Probability":"'+value+'"}')
      pm.addParameter(nameValuePair)
      httpClient.executeMethod(pm)
    } else {


    var recommendations = new DataSet('Results:'+search('AnalysisToUpload') as String).find()
    for(result in recommendations) {
      var company = result.get('Company') as String
      var policy = result.get('Policy') as String
      var value = result.get('Value') as String
      var nameValuePair = new NameValuePair()
      nameValuePair.setName("data")
      nameValuePair.setValue('{"AccountId":"001o0000003Jdkf","Name":"'+company+', '+policy+'", "StageName":"Prospecting", "Probability":"'+value+'"}')
      pm.addParameter(nameValuePair)
      httpClient.executeMethod(pm)
    }

    this.StatusFeed = "Done"
    this.Progress = 100

    }

  }

  override function reset() {
  }

  override function renderToString(): String {
    return "Salesforce Job"
  }
}