package util

uses java.util.Map
uses java.util.HashMap
uses org.json.simple.JSONObject

class Opportunity implements SalesforceObject {
  var args : Map<String, String>

  construct(name : String, accountId : String, closeDate : String, stage : String) {
    args = new HashMap<String, String>()
    args["Name"] = name
    args["AccountId"] = accountId
    args["CloseDate"] = closeDate
    args["StageName"] = stage
  }

  override property get SObjectName(): String {
    return "Opportunity"
  }

  property set Probability(prob : String) {
    args["Probability"] = prob
  }

  property set Amount(amt: String) {
    args["Amount"] = amt
  }

  property set NextStep(ns : String) {
    args["NextStep"] = ns
  }

  property set Description(d: String) {
    args["Description"] = d
  }

  override property get Json(): JSONObject {
    var obj = new JSONObject()
    for (entry in args.entrySet()) {
      obj.put(entry.Key, entry.Value)
    }
    return obj
  }

  /* Obviously there are more possible fields, but these are all we need for now. */


}