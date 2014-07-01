package jobs

uses java.util.Map
uses java.lang.System
uses util.SalesforceRESTClient

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
    this.Progress = 5

    var sClient = new SalesforceRESTClient(search('AuthCode') as String)
    this.StatusFeed = "Salesforce Authorized"
    this.Progress = 15

    /*** Eventually, the creation and posting of opportunities will go in a loop over the recommendations at
     *   var recommendations = new DataSet('Results:'+search('AnalysisToUpload') as String).find() ***/
    // For a list of Opportunity fields, please visit: https://www.salesforce.com/us/developer/docs/api/Content/sforce_api_objects_opportunity.htm
    var opportunity = {
        "Name" -> "Test Company 1",
        "AccountId" -> System.Env["SF_ACCOUNT_ID"]?.toString(),
        "CloseDate" -> "2014-07-07",
        "Probability" -> "98",
        "StageName" -> "Qualification",
        "Description" -> "Maps are cool"
    }
    var result = sClient.post("Opportunity", opportunity)
    if (result.get("success") as Boolean) {
      this.StatusFeed = "Successful opportunity upload! Available at: "+sClient.InstanceURL+"/"+opportunity["AccountId"]
    } else {
      this.StatusFeed = "Failed upload. Response from Salesforce: "+result
    }

    this.StatusFeed = "Job Terminated"
    this.Progress = 100
  }

  override function reset() {
  }

  override function renderToString(): String {
    return "Salesforce Job"
  }
}