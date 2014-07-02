package model

uses com.mongodb.*
uses java.util.Map
uses util.TransformIterable

class DataSet {

  var _collection : DBCollection

  construct(collectionName : String) {
    _collection = Database.INSTANCE.getCollection(collectionName)
  }

 /* Automatically sorts from oldest to newest */
  function find(ref : Map<Object, Object>) : TransformIterable<Map<Object,Object>> {
     return new TransformIterable<Map<Object,Object>>(
         _collection.find(new BasicDBObject(ref))
                            .sort(new BasicDBObject({'_id' -> -1})),
                             \ o  -> (o as BasicDBObject))
  }

  /* Automatically sorts from oldest to newest */
  function find(ref : Map<Object, Object>, keys : Map<Object, Object>) : TransformIterable<Map<Object,Object>> {
    return new TransformIterable<Map<Object,Object>>(
        _collection.find(new BasicDBObject(ref),
                          new BasicDBObject(keys))
                          .sort(new BasicDBObject({'_id' -> -1})),
                          \ o -> (o as BasicDBObject))

  }

  /* Automatically sorts from oldest to newest */
  function find() : TransformIterable<Map<Object,Object>> {
    return new TransformIterable<Map<Object,Object>>(
        _collection.find().sort(new BasicDBObject({'_id' -> -1})), \ o -> (o as BasicDBObject))
  }

  function queryOr(values : List<String>, key : String) : TransformIterable<Map<Object,Object>> {
    var document = new BasicDBObject()
    var qb = new QueryBuilder()
    var list : List<DBObject> = {}
    for (item in values) {
      var o = new BasicDBObject()
      o[key] = item
      list.add(o)
    }
    qb.or(list.toTypedArray())
    document.putAll(qb.get())
    return new TransformIterable<Map<Object,Object>>(
        _collection.find(document).sort(new BasicDBObject({'_id' -> -1})), \ o -> (o as BasicDBObject))
  }

  function queryNot(key : String, value : String) : TransformIterable<Map<Object,Object>> {
    var document = new BasicDBObject()
    var qb = new QueryBuilder()
    qb.put(key).notEquals(value)
    document.putAll(qb.get())
    return new TransformIterable<Map<Object,Object>>(
        _collection.find(document).sort(new BasicDBObject({'_id' -> -1})), \ o -> (o as BasicDBObject))
  }


  function findOne(ref : Map<Object, Object>) : Map<Object, Object> {
    return _collection.findOne(new BasicDBObject(ref))?.toMap()
  }

  function insert(o : Map<Object, Object>) : WriteResult {
    return _collection.insert( new BasicDBObject(o), WriteConcern.ACKNOWLEDGED)
  }

  function insert(objects : List<Map<Object, Object>>) : WriteResult {
    return _collection.insert(objects.map(\ o -> new BasicDBObject(o)), WriteConcern.ACKNOWLEDGED)
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
    return _collection.save(new BasicDBObject(o),WriteConcern.ACKNOWLEDGED)
  }

  function update(q : Map<Object, Object>, o : Map<Object, Object>) {
    var current = _collection.findOne(new BasicDBObject(q))
    if (current != null) {
      current.putAll(new BasicDBObject(o))
    } else {
      current = new BasicDBObject(o)
    }
    _collection.update(new BasicDBObject(q), current,false,false,WriteConcern.ACKNOWLEDGED)
  }

  function drop() {
    _collection.drop()
  }

}