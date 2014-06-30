package jobs

uses java.util.Map
uses org.apache.commons.httpclient.methods.PostMethod
uses org.apache.commons.httpclient.HttpClient
uses org.json.simple.JSONObject
uses org.json.simple.JSONValue
uses org.apache.commons.httpclient.methods.StringRequestEntity

class SalesforceAuthJob extends Job {
  static final var ACCOUNT_ID = "001o0000003d6P4"
  static final var CLIENT_ID = "3MVG9xOCXq4ID1uFvTCKN7SyVYdNd2wGzeDj0D.bK751bqhCLLzaTqEfj8GVVPI1c3AY83tn8fRdVl09T7Wqg"
  static final var CLIENT_SECRET = "5207032927813523155"
  static final var REDIRECT_URI = "https://gosuroku.herokuapp.com/_auth"

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
    this.Progress = 5
    /* This code receives the the authorization code from the authorization endpoint, then requests for the access
     * token to access protected salesforce resources. */
    var code = search('AuthCode') as String
    var httpClient = new HttpClient();
    var postAuth = new PostMethod("https://login.salesforce.com/services/oauth2/token");
    postAuth.addParameter("grant_type","authorization_code");
    postAuth.addParameter("client_id",CLIENT_ID);
    postAuth.addParameter("client_secret",CLIENT_SECRET);
    postAuth.addParameter("redirect_uri", REDIRECT_URI);
    postAuth.addParameter("code",code);
    httpClient.executeMethod(postAuth)
    this.StatusFeed = "Sent authorization request"
    this.Progress = 10
    
    /* Receive response with access token. Access token must be used for all following requests */
    var json = JSONValue.parse(postAuth.getResponseBodyAsString()) as JSONObject
    var accessToken = json.get("access_token") as String
    var instanceUrl = json.get("instance_url") as String
    this.StatusFeed = "Received response."

    // Create Opportunity from Company Information and send to Salesforce via POST method
    var opp = new JSONObject()
    opp.put("Name","Testing Corp - ")
    opp.put("AccountId", ACCOUNT_ID)
    opp.put("StageName","Qualification")
    opp.put("Probability", "99.8")
    opp.put("CloseDate","2014-07-07")
    var postOpp = new PostMethod(instanceUrl+"/services/data/v20.0/sobjects/Opportunity/")
    postOpp.setRequestHeader("Authorization", "Bearer "+accessToken)
    postOpp.setRequestEntity(new StringRequestEntity(opp.toString(), "application/json", null))
    httpClient.executeMethod(postOpp)

    // Receive POST message response
    json = JSONValue.parse(postOpp.getResponseBodyAsString()) as JSONObject
    var success = json.get("success") as Boolean
    if (success) {
      this.StatusFeed = "Successful upload! Opportunities available at "+instanceUrl+ACCOUNT_ID
    } else {
      this.StatusFeed = "Failed upload. Response from Salesforce: "+json
    }
    this.StatusFeed = "Done"
    this.Progress = 100

/*********** Iterate through recommendations and convert them into opportunities to post. *******************
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
*/
  }

  override function reset() {
  }

  override function renderToString(): String {
    return "Salesforce Job"
  }
}