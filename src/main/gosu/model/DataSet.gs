package model

uses com.mongodb.*
uses java.util.Map

class DataSet {

  var _collection : DBCollection

  construct(collectionName : String) {
    _collection = Database.getCollection(collectionName)
  }

  function find(ref : Map<Object, Object>) : List<Map<Object, Object>> {
     return _collection.find(new BasicDBObject(ref))
                       .toArray().map(\ o -> o.toMap())
  }

  function find(ref : Map<Object, Object>, keys : Map<Object, Object>) : List<Map<Object, Object>> {
    return _collection.find(new BasicDBObject(ref),new BasicDBObject(keys))
        .toArray().map(\ o -> o.toMap())
  }

  function find() : List<Map<Object, Object>> {
    return _collection.find()
        .toArray().map(\ o -> o.toMap())
  }

  function findOne(ref : Map<Object, Object>) : Map<Object, Object> {
    return _collection.findOne(new BasicDBObject(ref))?.toMap()
  }

  function insert(o : Map<Object, Object>) : WriteResult {
    return _collection.insert( new BasicDBObject(o), new WriteConcern())
  }

  function insert(objects : List<Map<Object, Object>>) :WriteResult {
    return _collection.insert(objects.map(\ o -> new BasicDBObject(o)))
  }

  property get Count() : long {
    return _collection.getCount()
  }

  function getCount(o : Map<Object, Object>) : long {
    return _collection.getCount(new BasicDBObject(o))
  }

  function remove(o : Map<Object, Object>) : WriteResult {
    return _collection.remove(new BasicDBObject(o))
  }

  function save(o : Map<Object, Object>) : WriteResult {
    return _collection.save(new BasicDBObject(o))
  }

  function update(q : Map<Object, Object>, o : Map<Object, Object>) : WriteResult {
    return _collection.update(new BasicDBObject(q), new BasicDBObject(o))
  }

  function drop() {
    _collection.drop()
  }

}