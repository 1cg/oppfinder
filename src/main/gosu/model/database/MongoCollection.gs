package model.database

uses java.util.Map
uses util.iterable.TransformIterable
uses com.mongodb.WriteConcern
uses com.mongodb.BasicDBObject
uses com.mongodb.DBCollection
uses com.mongodb.QueryBuilder
uses com.mongodb.DBObject
uses com.mongodb.WriteResult
uses org.bson.types.ObjectId

class MongoCollection {

  var _collection : DBCollection

  construct(collectionName : String) {
    _collection = Database.INSTANCE.getCollection(collectionName)
  }

 /* Automatically sorts from oldest to newest */
  function find(ref : Map<String, Object>) : TransformIterable<BasicDBObject> {
     return new TransformIterable<BasicDBObject>(
         _collection.find(new BasicDBObject(ref))
                            .sort(new BasicDBObject({'_id' -> -1})),
                             \ o  -> o as BasicDBObject)
  }

  /* Automatically sorts from oldest to newest */
  function find(ref : Map<String, Object>, keys : Map<String, Object>) : TransformIterable<BasicDBObject> {
    return new TransformIterable<BasicDBObject>(
        _collection.find(new BasicDBObject(ref), new BasicDBObject(keys))
                          .sort(new BasicDBObject({'_id' -> -1})),
                          \ o -> o as BasicDBObject)

  }

  /* Automatically sorts from oldest to newest */
  function find() : TransformIterable<BasicDBObject> {
    return new TransformIterable<BasicDBObject>(
        _collection.find().sort(new BasicDBObject({'_id' -> -1})), \ o -> o as BasicDBObject)
  }

  property get Name() : String {
    return _collection.Name
  }

  function queryNot(key : String, value : String) : TransformIterable<BasicDBObject> {
    var document = new BasicDBObject()
    var qb = new QueryBuilder()
    qb.put(key).notEquals(value)
    document.putAll(qb.get())
    return new TransformIterable<BasicDBObject>(
        _collection.find(document).sort(new BasicDBObject({'_id' -> -1})), \ o -> o as BasicDBObject)
  }

  function findOne(ref : DBObject) : BasicDBObject {
    return _collection.findOne(ref) as BasicDBObject
  }

  function findOne() : BasicDBObject {
    return _collection.findOne() as BasicDBObject
  }

  function insert(o : Map<String, Object>) : ObjectId {
    var doc = new BasicDBObject(o)
    _collection.insert(doc, WriteConcern.ACKNOWLEDGED)
    return doc.get('_id') as ObjectId
  }

  function insert(objects : List<Map<String, Object>>) : WriteResult {
    return _collection.insert(objects.map(\ o -> new BasicDBObject(o)), WriteConcern.ACKNOWLEDGED)
  }

  property get Count() : long {
    return _collection.getCount()
  }

  function getCount(o : Map<String, Object>) : long {
    return _collection.getCount(new BasicDBObject(o))
  }

  function remove(o : Map<String, Object>) : WriteResult {
    return _collection.remove(new BasicDBObject(o), WriteConcern.ACKNOWLEDGED)
  }

  function remove(key : String, value : Object) : WriteResult {
    return _collection.remove(new BasicDBObject(key,value), WriteConcern.ACKNOWLEDGED)
  }

  function save(o : Map<String, Object>) : WriteResult {
    return _collection.save(new BasicDBObject(o),WriteConcern.ACKNOWLEDGED)
  }

  function update(q : DBObject, o : DBObject) {
    _collection.update(q, new BasicDBObject('$set',o),false,false,WriteConcern.ACKNOWLEDGED)
  }

  function increment(q : DBObject, o : DBObject) {
    _collection.update(q, new BasicDBObject('$inc',o),false,false,WriteConcern.ACKNOWLEDGED)
  }

  function drop() {
    _collection.drop()
  }

}