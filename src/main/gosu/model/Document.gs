package model

uses com.mongodb.BasicDBObject
uses java.util.Map
uses java.util.Set
uses com.mongodb.DBObject

class Document {

  var _obj : DBObject
  var _id : Object
  var _collection : MongoCollection
  var inserted : boolean

  construct(collection : MongoCollection) {
    _obj = new BasicDBObject()
    _collection = collection
    inserted = false
  }

  construct(obj : DBObject, collection : MongoCollection) {
    _obj = obj
    _collection = collection
    _id = _obj['_id']
    inserted = true
  }

  function upsert(key : String, value : Object) {
    _obj.put(key, value)
  }

  function upsertAll(upserts : Map<String, Object>) {
    _obj.putAll(upserts)
  }

  function getField(value : String) : Object {
    return _obj[value]
  }

  function allFields() : Set<String> {
    //Remove oid
    return _obj.keySet()
  }

  function save() {
    if (inserted) {
      _collection.update(new BasicDBObject('_id',_obj['_id']), _obj)
    } else {
      _id = _collection.insert(_obj).UpsertedId
    }
  }

  function update() {
    _obj = _collection.findOne({'_id' -> _id})
  }

}