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
uses model.MongoCollection
uses java.lang.Exception
uses salesforce.SObject

class SalesforceAuthJob extends Job {
  static final var SF_REDIRECT_URI  = "https://gosuroku.herokuapp.com/results"
  static final var SF_ACCOUNT_ID    = System.Env["SF_ACCOUNT_ID"]?.toString()
  static final var SF_CLIENT_ID     = System.Env["SF_CLIENT_ID"]?.toString()
  static final var SF_CLIENT_SECRET = System.Env["SF_CLIENT_SECRET"]?.toString()

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
    var salesforce = new SalesforceRESTClient(SF_CLIENT_ID, SF_CLIENT_SECRET)
    var authResponse = salesforce.authenticate(search('AuthCode') as String, SF_REDIRECT_URI)
    var err = authResponse.get("error") as String

    if (err == null) { // Authorized without error
      var tokenStore = new MongoCollection("SalesforceRefreshToken")
      tokenStore.drop()
      tokenStore.insert({"RefreshToken" -> authResponse.get("refresh_token") as String})
      this.StatusFeed = "Connected!"
    } else if (err == "invalid_grant") { // need to use refresh token
      var refreshToken = new MongoCollection("SalesforceRefreshToken").find()?.iterator()?.next().get("RefreshToken")
      salesforce.refresh(refreshToken as String)
      this.StatusFeed = "Token Refreshed!"
    } else {
      handleErrorState(new Exception("Error: "+err))
    }

    /*
     * ---- Upload to Salesforce ----
     */
    var recUUID = search('RecommendUUID') as String
    this.StatusFeed = "Uploading results from <a href=https://gosuroku.herokuapp.com/results/"+recUUID+">"+recUUID+"</a>"
    var recommendations = Results.getResults(recUUID)
    var date = date()
    var s = search('SelectCompanies') as String
    var selectCompanies = null as List
    if (s != null) selectCompanies = Arrays.asList(s.replace("\"", "").replace(" ","").substring(1, s.length -1).split(","))

    for (recommendation in recommendations index i) {
      if (s != null && !selectCompanies.contains(i as String)) {
        continue
      }
      this.StatusFeed = "Uploading recommendation "+(i+1)+": "+recommendation['Company']
      this.Progress = Math.max(10, (i * 100) / recommendations.size())
      checkCancellation()
      Thread.sleep(4500) //Don't go over the API limit (5 requests per 20 seconds)!

      var opp = new SObject("Opportunity")
      opp["Name"] = recommendation['Company'] as String
      opp["AccountId"] = SF_ACCOUNT_ID
      opp["CloseDate"] = date
      opp["Probability"] = String.valueOf(Double.parseDouble(recommendation['Value'] as String) * 100)
      opp["StageName"] = "Qualification"
      opp["Description"] = "It is recommended that this company take on the "+recommendation['Policy']+" policy."

      var result = salesforce.httpPost("Opportunity", opp.ObjectData)
      if (!(result.get("success") as Boolean)) {
        this.StatusFeed = "Failed upload. Response from Salesforce: "+result
      }
    }
    this.StatusFeed = "Done! Uploads available as opportunities <a href=${salesforce.InstanceURL}/${SF_ACCOUNT_ID}>on Salesforce</a>"
    this.Progress = 100
  }

  override function doReset() {
  }

  override function renderToString(): String {
    return view.jobs.drilldowns.SalesforceUpload.renderToString(this)
  }

  /* Returns current date in Salesforce Object Date field format */
  private function date() : String {
    var cal = Calendar.getInstance()
    return cal.get(Calendar.YEAR)+"-"+(cal.get(Calendar.MONTH) + 1)+"-"+cal.get(Calendar.DATE)
  }
}