package util

uses org.apache.commons.httpclient.HttpClient
uses org.apache.commons.httpclient.methods.PostMethod
uses org.json.simple.JSONValue
uses org.json.simple.JSONObject
uses org.apache.commons.httpclient.methods.StringRequestEntity
uses java.util.Map
uses java.lang.System

class SalesforceRESTClient {
  static final var SF_TOKEN_SITE = "https://login.salesforce.com/services/oauth2/token"
  static final var SF_REDIRECT_URI = "https://gosuroku.herokuapp.com/_auth"

  var _httpClient : HttpClient
  var _accessToken : String
  var _instanceUrl : String

  // Should construct take responsibility of OAuth? Or should uses always require a client.init() call?
  /* This code receives the the authorization code from the authorization endpoint, then requests for the access
   * token to access protected salesforce resources. */
  construct(authorizationCode : String) {
    _httpClient = new HttpClient()

    var postAuth = new PostMethod(SF_TOKEN_SITE)
    postAuth.addParameter("grant_type", "authorization_code")
    postAuth.addParameter("client_id", System.Env["SF_CLIENT_ID"]?.toString())
    postAuth.addParameter("client_secret", System.Env["SF_CLIENT_SECRET"]?.toString())
    postAuth.addParameter("redirect_uri", SF_REDIRECT_URI)
    postAuth.addParameter("code", authorizationCode)
    _httpClient.executeMethod(postAuth)

    var json = JSONValue.parse(postAuth.getResponseBodyAsString()) as JSONObject
    _accessToken = json.get("access_token") as String
    _instanceUrl = json.get("instance_url") as String
  }


  function post(sObjectName : String, data : Map<String, String>) : JSONObject {
    var post = new PostMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObjectName)
    post.setRequestHeader("Authorization", "Bearer "+_accessToken)
    post.setRequestEntity(new StringRequestEntity(JSONValue.toJSONString(data), "application/json", null))
    _httpClient.executeMethod(post)
    return JSONValue.parse(post.getResponseBodyAsString()) as JSONObject
  }



  //constructor should simply initialize,

}