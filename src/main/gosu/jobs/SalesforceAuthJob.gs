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

class SalesforceAuthJob extends Job {
  static final var SF_TOKEN_SITE = "https://login.salesforce.com/services/oauth2/token"
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

    var authCode = search('AuthCode') as String
    var clientID = System.Env["SF_CLIENT_ID"]?.toString()
    var clientSecret = System.Env["SF_CLIENT_SECRET"]?.toString()
    var sClient = new SalesforceRESTClient(authCode, SF_TOKEN_SITE, SF_REDIRECT_URI, clientID, clientSecret)

    this.StatusFeed = "Salesforce Authorized"
    this.StatusFeed = "Recommending results from "+search('RecommendUUID') as String
    var cal = Calendar.getInstance()
    var accountID = System.Env["SF_ACCOUNT_ID"]?.toString()
    var recommendations = Results.getResults(search('RecommendUUID') as String)

    this.StatusFeed = "recommendations: "+recommendations.toString()
    var s = search('SelectCompanies') as String
    var selectCompanies = null as List
    if (s != null) {
      s = s.replace("\"", "").replace(" ","")
      selectCompanies = Arrays.asList(s.substring(1, s.length -1).split(","))
    }

    this.StatusFeed = "selected companies"


    this.StatusFeed = "Companies selected..."

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
        "CloseDate" -> cal.get(Calendar.YEAR)+"-"+(cal.get(Calendar.MONTH) + 1)+"-"+cal.get(Calendar.DATE) as String,
        "Probability" -> String.valueOf(Double.parseDouble(recommendation['Value'] as String) * 100),
        "StageName" -> "Qualification",
        "Description" -> "It is recommended that this company take on the "+recommendation['Policy']+" policy."
      }
      this.StatusFeed = "what 2"

      var result = sClient.httpPost("Opportunity", opportunity)
      this.StatusFeed = "what 3"

      if (!(result.get("success") as Boolean)) {
        this.StatusFeed = "Failed upload. Response from Salesforce: "+result
      }
    }

    this.StatusFeed = "Uploads available as opportunities <a href=${sClient.InstanceURL}/${accountID}>on Salesforce</a>"
    this.StatusFeed = "Done"
    this.Progress = 100
  }

  override function doReset() {
  }

  override function renderToString(): String {
    return view.jobs.drilldowns.SalesforceUpload.renderToString(this)
  }
}