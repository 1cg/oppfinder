package util

uses org.json.simple.JSONObject

interface SalesforceObject {
  /* Implementing constructors should take all Salesforce required arguments */
  /* SObject name string is necessary for the REST API to send the correct request */
  property get SObjectName() : String
  property get Json() : JSONObject
}