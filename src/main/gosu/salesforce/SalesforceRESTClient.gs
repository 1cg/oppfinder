package salesforce

uses org.apache.commons.httpclient.HttpClient
uses org.apache.commons.httpclient.methods.PostMethod
uses org.json.simple.JSONValue
uses org.json.simple.JSONObject
uses org.apache.commons.httpclient.methods.StringRequestEntity
uses java.util.Map
uses org.apache.commons.httpclient.methods.GetMethod
uses org.apache.commons.httpclient.methods.DeleteMethod

class SalesforceRESTClient {
  static final var SF_TOKEN_SITE = "https://login.salesforce.com/services/oauth2/token"

  var _httpClient : HttpClient
  var _clientID : String
  var _clientSecret : String
  var _accessToken : String
  var _refreshToken : String
  var _instanceUrl : String
  var _response : String

  /* This code receives authorization code from authorization endpoint, then requests for access
   * token to access protected salesforce resources. */
  construct(authorizationCode : String, redirectURI : String,
            clientID : String, clientSecret : String) {
    var postAuth = new PostMethod(SF_TOKEN_SITE)
    _clientID = clientID
    _clientSecret = clientSecret
    postAuth.addParameter("grant_type", "authorization_code")
    postAuth.addParameter("client_id", clientID)
    postAuth.addParameter("client_secret", clientSecret)
    postAuth.addParameter("redirect_uri", redirectURI)
    postAuth.addParameter("code", authorizationCode)
    _httpClient = new HttpClient()
    _httpClient.executeMethod(postAuth)
    var response = JSONValue.parse(postAuth.getResponseBodyAsString()) as JSONObject
    _response = response.toJSONString()
    _accessToken = response.get("access_token") as String
    _refreshToken = response.get("refresh_token") as String
    _instanceUrl = response.get("instance_url") as String
  }

  private function refresh() {
    var post = new PostMethod(SF_TOKEN_SITE)
    post.addParameter("grant_type", "refresh_token")
    post.addParameter("client_id", _clientID)
    post.addParameter("client_secret", _clientSecret)
    post.addParameter("refresh_token", _refreshToken)
    _httpClient.executeMethod(post)
    _accessToken = (JSONValue.parse(post.getResponseBodyAsString()) as JSONObject).get("access_token") as String
  }


  property get InstanceURL() : String {
    return _instanceUrl
  }

  property get Response() : String {
    return _response

  }

  function insert(sObject : SObject) : JSONObject {
    var post = new PostMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObject.ObjectType)
    post.setRequestHeader("Authorization", "Bearer "+_accessToken)
    post.setRequestEntity(new StringRequestEntity(JSONValue.toJSONString(sObject.ObjectData), "application/json", null))
    _httpClient.executeMethod(post)
    var response = JSONValue.parse(post.getResponseBodyAsString()) as JSONObject
    sObject.ObjectId = response["id"] as String
    return response
  }

  function retrieveObjectMetadata(sObjectType : String) : JSONObject {
    var httpGet = new GetMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObjectType)
    httpGet.setRequestHeader("Authorization", "Bearer "+_accessToken)
    _httpClient.executeMethod(httpGet)
    return JSONValue.parse(httpGet.getResponseBodyAsString()) as JSONObject
  }

  function update(objectType : String, targetId : String, updateFields : Map<String, String>) : JSONObject{
    var patch = new PostMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+objectType+"/"+targetId+"?_HttpMethod=PATCH")
    patch.setRequestHeader("Authorization", "Bearer "+_accessToken)
    patch.setRequestEntity(new StringRequestEntity(JSONValue.toJSONString(updateFields), "application/json", "UTF-8"))
    _httpClient.executeMethod(patch)
    return JSONValue.parse(patch.getResponseBodyAsString()) as JSONObject
  }

  function delete(sObjectType : String, id : String) : JSONObject{
    var delete = new DeleteMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObjectType+"/"+id)
    delete.setRequestHeader("Authorization", "Bearer "+_accessToken)
    _httpClient.executeMethod(delete)
    return JSONValue.parse(delete.getResponseBodyAsString()) as JSONObject
  }

  function getFields(sObjectType : String, id : String, fields : String[]) : JSONObject {
    var URI = _instanceUrl+"/services/data/v20.0/sobjects/"+sObjectType+"/"+id+"?fields="
    for (field in fields index i) {
      URI+=field
      if (i < fields.length-1) URI += ","
    }
    var httpGet = new GetMethod(URI)
    httpGet.setRequestHeader("Authorization", "Bearer "+_accessToken)
    _httpClient.executeMethod(httpGet)
    return JSONValue.parse(httpGet.getResponseBodyAsString()) as JSONObject
  }

///////// TRASH
  function httpPost(sObjectType : String, data : Map<String, String>) : JSONObject {
    var post = new PostMethod(_instanceUrl+"/services/data/v20.0/sobjects/"+sObjectType)
    post.setRequestHeader("Authorization", "Bearer "+_accessToken)
    post.setRequestEntity(new StringRequestEntity(JSONValue.toJSONString(data), "application/json", null))
    _httpClient.executeMethod(post)
    var response = JSONValue.parse(post.getResponseBodyAsString()) as JSONObject
    if (response.get("error_description") != null) {
      refresh()
      return httpPost(sObjectType, data)
    }
    return response
  }

  function httpGet(requestURI : String) : String {
    var httpGet = new GetMethod(requestURI)
    httpGet.setRequestHeader("Authorization", "Bearer "+_accessToken)
    _httpClient.executeMethod(httpGet)
    return httpGet.getResponseBodyAsString()
  }


}