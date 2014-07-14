package jobs

uses java.util.Map
uses java.lang.System
uses salesforce.SalesforceRESTClient
uses java.util.Calendar
uses java.lang.Double
uses java.lang.Thread
uses model.Results
uses java.lang.Math
uses java.util.Arrays
uses org.apache.commons.httpclient.methods.PostMethod
uses org.apache.commons.httpclient.methods.StringRequestEntity
uses org.json.simple.JSONValue
uses model.MongoCollection
uses model.DataSet
uses java.lang.Exception
uses org.json.simple.JSONObject

class SalesforceAuthJob extends Job {
  static final var SF_REDIRECT_URI = "https://gosuroku.herokuapp.com/results"

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct(recommendUUID : String, authCode : String, selectCompanies : String[]) {
    super()
    update({'RecommendUUID' -> recommendUUID})
    update({'AuthCode' -> authCode})
    update({'SelectCompanies' -> selectCompanies})
  }

  override function executeJob() {
    checkCancellation()
    this.StatusFeed= "Connecting to Salesforce..."
    this.Progress = 5
    /*
     * ---- Access Salesforce Resources ----
     */
    var authCode = search('AuthCode') as String
    var clientID = System.Env["SF_CLIENT_ID"]?.toString()
    var clientSecret = System.Env["SF_CLIENT_SECRET"]?.toString()
    var salesforce = new SalesforceRESTClient(clientID, clientSecret)
    var authResponse = new JSONObject()
    try {
      authResponse = salesforce.authenticate(authCode, SF_REDIRECT_URI)
    } catch (e) {
      this.StatusFeed = "error: "+e
    }
    this.StatusFeed = "dafq"
    if (authResponse.get("error") as String == null) { // Authorized without error
      this.StatusFeed = "token store??" + authResponse.get("refresh_token")
      var tokenStore = new MongoCollection("SalesforceRefreshToken")
      tokenStore.drop()
      tokenStore.insert({"RefreshToken" -> authResponse.get("refresh_token") as String})
      this.StatusFeed = "Connected!"
    } else if (authResponse.get("error") as String == "invalid_grant") { // need to use refresh token
      this.StatusFeed = "refresh token???"
      var refreshToken = new MongoCollection("SalesforceRefreshToken").find()?.iterator()?.next().get("RefreshToken") as String
      try {
        this.StatusFeed = "it wasn't the mongo thing"
        salesforce.refresh(refreshToken)
      } catch (e) {
        this.StatusFeed = "error omg "+e
      }
      this.StatusFeed = "Token Refreshed!"
    } else { // ERROR
      this.StatusFeed = "Error! "+authResponse.get("error") as String
      handleErrorState(new Exception("Error: "+(authResponse.get("error") as String)))
    }

    /*
     * ---- Upload to Salesforce ----
     */
    this.StatusFeed = "Recommending results from "+search('RecommendUUID') as String
    var accountID = System.Env["SF_ACCOUNT_ID"]?.toString()
    var recommendations = Results.getResults(search('RecommendUUID') as String)
    var date = getDate()
    this.StatusFeed = "recommendations: "+recommendations.toString()
    var s = search('SelectCompanies') as String
    var selectCompanies = null as List
    if (s != null) {
      s = s.replace("\"", "").replace(" ","")
      selectCompanies = Arrays.asList(s.substring(1, s.length -1).split(","))
    }

    // NOTE: API Request limit for Developer Edition is 5 requests per 20 seconds
    for (recommendation in recommendations index i) {
      if (s != null && !selectCompanies.contains(i as String)) {
        this.StatusFeed = "skipped: " + recommendation['Company']
        continue
      }
      this.StatusFeed = "Uploading recommendation "+(i+1)+": "+recommendation['Company']
      Thread.sleep(4500) //Don't go over the API limit!
      this.Progress = Math.max(10, (i * 100) / recommendations.size())
      this.StatusFeed = "what 0"

      checkCancellation()
      this.StatusFeed = "what 1"
      var opportunity = {
        "Name" -> recommendation['Company'] as String,
        "AccountId" -> accountID,
        "CloseDate" -> date,
        "Probability" -> String.valueOf(Double.parseDouble(recommendation['Value'] as String) * 100),
        "StageName" -> "Qualification",
        "Description" -> "It is recommended that this company take on the "+recommendation['Policy']+" policy."
      }
      this.StatusFeed = "what 2"
      var result = salesforce.httpPost("Opportunity", opportunity)
      this.StatusFeed = "what 3"

      if (!(result.get("success") as Boolean)) {
        this.StatusFeed = "Failed upload. Response from Salesforce: "+result
      }
    }

    this.StatusFeed = "Uploads available as opportunities <a href=${salesforce.InstanceURL}/${accountID}>on Salesforce</a>"
    this.StatusFeed = "Done"
    this.Progress = 100
  }

  override function doReset() {
  }

  override function renderToString(): String {
    return view.jobs.drilldowns.SalesforceUpload.renderToString(this)
  }

  /* Returns current date in Salesforce Object Date field format */
  private function getDate() : String {
    var cal = Calendar.getInstance()
    return cal.get(Calendar.YEAR)+"-"+(cal.get(Calendar.MONTH) + 1)+"-"+cal.get(Calendar.DATE)
  }
}