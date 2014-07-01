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

    /* Not sure what's best practice for these kinds of variables; left it as environment variable for now. */
    var clientID = System.Env["SF_CLIENT_ID"]?.toString()
    var clientSecret = System.Env["SF_CLIENT_SECRET"]?.toString()
    var accountID = System.Env["SF_ACCOUNT_ID"]?.toString()
    var sClient = new SalesforceRESTClient(search('AuthCode') as String,clientID, clientSecret,REDIRECT_URI, accountID)
    this.StatusFeed = "Salesforce Authorized"

    /*** Eventually, the creation and posting of opportunities will go in a loop over the recommendations at
     *   var recommendations = new DataSet('Results:'+search('AnalysisToUpload') as String).find() ***/
    var opp = new Opportunity("Test Company", accountID, "2014-07-07", "Qualification")
    opp.Probability = "99"
    opp.Description = "These are optional fields for opportunity!"
    var result = sClient.post(opp)
    if (result.get("success") as Boolean) {
      this.StatusFeed = "Successful opportunity upload!"
    } else {
      this.StatusFeed = "Failed upload. Response from Salesforce: "+result
    }

    this.StatusFeed = "Done"
    this.Progress = 100

  }

  override function reset() {
  }

  override function renderToString(): String {
    return "Salesforce Job"
  }
}