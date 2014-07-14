package salesforce

uses org.json.simple.JSONObject
uses org.json.simple.JSONValue
uses java.util.Map
uses java.lang.Integer
uses org.json.simple.JSONArray

class Organization {
  static function listOrganizationLimits(c : SalesforceRESTClient) : JSONObject {
    var uri = c.InstanceURL+"/services/data/v29.0/limits"
    var response = JSONValue.parse(c.httpGet(uri)) as JSONObject
    return response
  }

  static function dailyApiRequests(c : SalesforceRESTClient) : Map {
    return listOrganizationLimits(c).get("DailyApiRequests") as Map
  }

  static function dailyApiRequestsRemaining(c : SalesforceRESTClient) : int {
    return dailyApiRequests(c)["Remaining"] as Integer
  }

  static function dailyApiRequestsMax(c : SalesforceRESTClient) : int {
    return dailyApiRequests(c)["Max"] as Integer
  }

  static function listAvailableRestResources(c : SalesforceRESTClient) : Map {
    var uri = c.InstanceURL+"/services/data/v26.0/"
    var response = JSONValue.parse(c.httpGet(uri)) as JSONObject
    return response
  }

  static function listAvailableRestApiVersions(c : SalesforceRESTClient) : JSONArray {
    return JSONValue.parse(c.httpGet(c.InstanceURL+"/services/data")) as JSONArray
  }

  /* Lists the objects available in your organization and to the logged-in user. */
  static function listObjects(c : SalesforceRESTClient) : List {
    var uri = c.InstanceURL+"/services/data/v26.0/sobjects/"
    var response = JSONValue.parse(c.httpGet(uri)) as JSONObject
    return response["sobjects"] as List<JSONObject>
  }

}