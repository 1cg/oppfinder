package salesforce

uses java.util.Map
uses java.util.HashMap

class SObject {
  var _objectData : Map<String, String>
  var _objectType : String
  var _objectID : String

  construct(objectType : String) {
    _objectData = new HashMap<String, String>()
    _objectType = objectType
  }

  function set(key : String, value : String) {
    _objectData[key] = value
  }

  property get ObjectType() : String {
    return _objectType
  }

  property get ObjectData() : Map<String, String> {
    return _objectData
  }

  property set ObjectId(id : String) {
    _objectID = id
  }

  property get ObjectId() : String {
    if (_objectID == null) throw "Object not yet assigned ID by Salesforce"
    else return _objectID
  }

}