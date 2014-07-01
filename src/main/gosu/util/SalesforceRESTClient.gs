package util

uses org.apache.commons.httpclient.HttpClient
uses org.apache.commons.httpclient.methods.PostMethod
uses org.json.simple.JSONValue
uses org.json.simple.JSONObject
uses org.apache.commons.httpclient.methods.StringRequestEntity

class SalesforceRESTClient {
  static final var SF_TOKEN_SITE = "https://login.salesforce.com/services/oauth2/token"

  var _httpClient : HttpClient
  var _accessToken : String
  var _instanceUrl : String
  var _accountID : String

  // Should construct take responsibility of OAuth? Or should uses always require a client.init() call?
  construct(authorizationCode : String, clientID : String, clientSecret : String, redirectURI : String, accountID : String) {
    _httpClient = new HttpClient()

    var postAuth = new PostMethod(SF_TOKEN_SITE)
    postAuth.addParameter("grant_type", "authorization_code")
    postAuth.addParameter("client_id", clientID)
    postAuth.addParameter("client_secret", clientSecret)
    postAuth.addParameter("redirect_uri", redirectURI)
    postAuth.addParameter("code", authorizationCode)
    _httpClient.executeMethod(postAuth)

    var json = JSONValue.parse(postAuth.getResponseBodyAsString()) as JSONObject
    _accessToken = json.get("access_token") as String
    _instanceUrl = json.get("instance_url") as String

    _accountID = accountID
  }

  property get AccountID() : String {
    return _accountID
  }

  property set AccountID(id : String) {
    _accountID = id
  }

  function post(sObject : SalesforceObject) : JSONObject {
    var post = new PostMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObject.SObjectName)
    post.setRequestHeader("Authorization", "Bearer "+_accessToken)
    post.setRequestEntity(new StringRequestEntity(sObject.Json.toString(), "application/json", null))
    _httpClient.executeMethod(post)

    return JSONValue.parse(post.getResponseBodyAsString()) as JSONObject
  }



  //constructor should simply initialize,

}