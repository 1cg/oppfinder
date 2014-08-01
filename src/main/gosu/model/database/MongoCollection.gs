package model.database

uses java.util.Map
uses com.mongodb.WriteConcern
uses com.mongodb.BasicDBObject
uses com.mongodb.DBCollection
uses model.database.iterable.TransformIterable
uses model.database.iterable.SkipIterable

class MongoCollection implements DataSet {

  var _collection : DBCollection

  construct (name : String) {
    _collection = MongoDatabase.INSTANCE.getCollection(name)
  }

  construct (collection : DBCollection) {
    _collection = collection
  }

  /* Automatically sorts from oldest to newest */
  override function find(query: Map<String, Object>, values: Map<String, Object> = null) : SkipIterable<BasicDBObject> {
    var value : BasicDBObject
    if (values != null) value = new BasicDBObject(values)
    return new TransformIterable<BasicDBObject>(_collection.find(new BasicDBObject(query), value).sort(new BasicDBObject({'_id' -> -1})),\ o -> o as BasicDBObject)
  }

  /* Automatically sorts from oldest to newest */
  override function all() : SkipIterable<BasicDBObject> {
    return new TransformIterable<BasicDBObject>(
        _collection.find().sort(new BasicDBObject({'_id' -> -1})), \ o -> o as BasicDBObject)
  }

  override property get Name() : String {
    return _collection.Name
  }

  override function first() : Map<String, Object> {
    return _collection.findOne() as BasicDBObject
  }

  override function insert(o : Map<String, Object>) : ID {
    var doc = new BasicDBObject(o)
    _collection.insert(doc, WriteConcern.ACKNOWLEDGED)
    return new ID(doc.get('_id'))
  }

  override property get Count() : long {
    return _collection.getCount()
  }

  override function remove(key : String, value : Object) {
    _collection.remove(new BasicDBObject(key,value), WriteConcern.ACKNOWLEDGED)
  }

  override function drop() {
    _collection.drop()
  }

  override function findOne(query: Map<String, Object>): Map<String, Object> {
    return _collection.findOne(new BasicDBObject(query)) as BasicDBObject
  }

  override function update(query: Map<String, Object>, values: Map<String, Object>) {
    _collection.update(new BasicDBObject(query), new BasicDBObject('$set',values),false,false,WriteConcern.ACKNOWLEDGED)
  }

  override function increment(query: Map<String, Object>, values: Map<String, Object>) {
    _collection.update(new BasicDBObject(query), new BasicDBObject('$inc', values), false, false, WriteConcern.ACKNOWLEDGED)
  }

  override property get IDName(): String {
    return '_id'
  }
}