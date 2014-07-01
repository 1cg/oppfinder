package jobs

uses java.util.Map
uses java.lang.System
uses util.SalesforceRESTClient
uses util.Opportunity

class SalesforceAuthJob extends Job {
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

    /* Not sure what's best practice for these variables; left it as environment variable for now. */
    var clientID = System.Env["SF_CLIENT_ID"]?.toString()
    var clientSecret = System.Env["SF_CLIENT_SECRET"]?.toString()
    var accountID = System.Env["SF_ACCOUNT_ID"]?.toString()
    var redirectURI = REDIRECT_URI

    /* This code receives the the authorization code from the authorization endpoint, then requests for the access
     * token to access protected salesforce resources. */
    var code = search('AuthCode') as String
    var sClient = new SalesforceRESTClient(code,clientID, clientSecret,redirectURI, accountID)

    var opp = new Opportunity("Test Company", accountID, "2014-07-07", "Qualification")
    opp.Probability = "99.8"
    opp.Description = "These are optional fields for opportunity!"

    var result = sClient.post(opp)
    if (result.get("success") as Boolean) {
      this.StatusFeed = "Successful opportunity upload!"
    } else {
      this.StatusFeed = "Failed upload. Response from Salesforce: "+result
    }
/*
    var httpClient = new HttpClient();
    var postAuth = new PostMethod("https://login.salesforce.com/services/oauth2/token");
    postAuth.addParameter("grant_type","authorization_code");
    postAuth.addParameter("client_id",clientID);
    postAuth.addParameter("client_secret",clientSecret);
    postAuth.addParameter("redirect_uri", redirectURI);
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
    /* This oppportunity is a proof of concept. When doing the real thing, needs to iterate over the
     * 'Results:'+search('AnalysisToUpload') recommendation dataset. */
    var opp = new JSONObject()
    opp.put("Name","Testing Corp - ")
    opp.put("AccountId", accountID)
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
      this.StatusFeed = "Successful upload! Opportunities available at "+instanceUrl+"/"+accountID
    } else {
      this.StatusFeed = "Failed upload. Response from Salesforce: "+json
    }
    */
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