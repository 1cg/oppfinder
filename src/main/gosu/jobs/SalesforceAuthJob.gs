package jobs

uses java.util.Map
uses java.lang.System
uses util.SalesforceRESTClient
uses java.util.Calendar
uses java.lang.Double
uses java.lang.Thread
uses model.Results
uses java.lang.Math

class SalesforceAuthJob extends Job {

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
    var sClient = new SalesforceRESTClient(search('AuthCode') as String)
    this.StatusFeed = "Salesforce Authorized"

    this.StatusFeed = "Recommending results from "+search('RecommendUUID') as String
    var cal = Calendar.getInstance()
    var year = cal.get(Calendar.YEAR)
    var month = cal.get(Calendar.MONTH) + 1
    var date = cal.get(Calendar.DATE)
    var closeDate = ""+year+"-"+month+"-"+date
    var accountID = System.Env["SF_ACCOUNT_ID"]?.toString()
    var recommendations = Results.getResults(search('RecommendUUID') as String)
    var selectCompanies = search('SelectCompanies') as String[]

    // NOTE: API Request limit for Developer Edition is 5 requests per 20 seconds
    for (recommendation in recommendations index i) {
      if (!selectCompanies.contains(i as String)) {
        print("skipped: " + recommendation['Company'])
        continue
      }
      this.StatusFeed = "Uploading recommendation "+(i+1)
      Thread.sleep(4500) //Don't go over the API limit!
      this.Progress = Math.max(10, (i * 100) / recommendations.size())
      checkCancellation()
      var opportunity = {
        "Name" -> recommendation['Company'] as String,
        "AccountId" -> accountID,
        "CloseDate" -> closeDate,
        "Probability" -> String.valueOf(Double.parseDouble(recommendation['Value'] as String) * 100),
        "StageName" -> "Qualification",
        "Description" -> "It is recommended that this company take on the "+recommendation['Policy']+" policy."
      }
      var result = sClient.post("Opportunity", opportunity)
      if (!(result.get("success") as Boolean)) {
        this.StatusFeed = "Failed upload. Response from Salesforce: "+result
      }
    }

    this.StatusFeed = "Uploads available <a href=${sClient.InstanceURL}/${accountID}>here</a>"
    this.StatusFeed = "Done"
    this.Progress = 100
  }

  override function doReset() {
  }

  override function renderToString(): String {
    return view.jobs.drilldowns.SalesforceUpload.renderToString(this)
  }
}