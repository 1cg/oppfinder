package model

uses com.mongodb.*
uses java.util.Map
uses java.util.Iterator
uses util.TransformationIterator

class DataSet {

  var _collection : DBCollection

  construct(collectionName : String) {
    _collection = Database.getCollection(collectionName)
  }

  function find(ref : Map<Object, Object>) : TransformationIterator<Map<Object,Object>> {
     return new TransformationIterator<Map<Object,Object>>(
         _collection.find(new BasicDBObject(ref)), \ o -> o)
  }

  function find(ref : Map<Object, Object>, keys : Map<Object, Object>) : TransformationIterator<Map<Object,Object>> {
    return new TransformationIterator<Map<Object,Object>>(
        _collection.find(new BasicDBObject(ref),new BasicDBObject(keys)), \ o -> o)

  }

  function find() : Iterator<Map<Object,Object>> {
    return new TransformationIterator<Map<Object,Object>>(
        _collection.find().sort(new BasicDBObject({'_id' -> -1})), \ o -> o)
  }

  function findOne(ref : Map<Object, Object>) : Map<Object, Object> {
    return _collection.findOne(new BasicDBObject(ref))?.toMap()
  }

  function insert(o : Map<Object, Object>) : WriteResult {
    return _collection.insert( new BasicDBObject(o), new WriteConcern())
  }

  function insert(objects : List<Map<Object, Object>>) : WriteResult {
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

  function update(q : Map<Object, Object>, o : Map<Object, Object>) {
    var current = _collection.findOne(new BasicDBObject(q))
    if (current != null) {
      current.putAll(new BasicDBObject(o))
    } else {
      current = new BasicDBObject(o)
    }
    _collection.update(new BasicDBObject(q), current)
  }

  function drop() {
    _collection.drop()
  }

}