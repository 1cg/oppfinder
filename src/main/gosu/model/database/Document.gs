package model.database

uses java.util.Map
uses util.iterable.SkipIterable
uses util.iterable.TransformIterable
uses java.lang.Class
uses java.util.Set
uses com.mongodb.BasicDBObject
uses com.mongodb.DBObject
uses util.inflector.Inflector
uses org.bson.types.ObjectId
uses com.mongodb.QueryBuilder

abstract class Document {

  /*
    -------Private Fields-------------------------------------------------
   */

  var _obj : BasicDBObject
  var _shadow : BasicDBObject
  var _id : ObjectId //Unique ID. This would be the primary key in a SQL database or a unique document ID in MongoDB
  var _collection : MongoCollection
  var inserted : boolean as readonly Persisted

  /*
   -------------Constructors----------------------------------------------
   */

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct() {
    _obj = new()
    _collection = new MongoCollection(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    inserted = false
  }

  construct(collection : String) {
    _obj = new()
    _collection = new MongoCollection(collection)
    inserted = false
  }

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct(key : String, value : Object) {
    _collection = new MongoCollection(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    reload(key, value)
    _shadow = new()
    _shadow.putAll(_obj)
    _id = _obj['_id'] as ObjectId
    inserted = true
  }

  construct(collection : String, key : String, value : Object) {
    _collection = new MongoCollection(collection)
    reload(key, value)
    _shadow = new()
    _shadow.putAll(_obj)
    _id = _obj['_id'] as ObjectId
    inserted = true
  }

  /*
  -----------------------Public methods--------------------------------------------
   */

  final function put(key: String, value: Object) {
    _obj.put(key, value)
  }

  final function putAll(upserts: Map<String, Object>) {
    _obj.putAll(upserts)
  }

  final function get(value: String) : Object {
    return _obj[value]
  }

  function delete() {
    _collection.remove('_id',_id)
    inserted = false
  }

  final function increment(field : String, by = 1) {
    _collection.increment(query(), new BasicDBObject(field, by))
  }

  final function decrement(field : String, by = 1) {
    increment(field, by*-1)
  }

  final function save() {
    if (inserted) {
      _collection.update(query(), shadowDiff())
    } else {
      _obj['intrinsic_type'] = this.IntrinsicType.Name
      _id = _collection.insert(_obj)
      _shadow = new()
      _shadow.putAll(_obj)
      inserted = true
    }
  }

  /*
  ---------------------Finders------------------------------------------------
   */

  static function find(key : String, value : Object, collection : String) : Document {
    var _collection = new MongoCollection(collection)
    return instantiate(_collection.findOne(new BasicDBObject(key, value)))
  }

  static function findMany(key : String, value : Object, collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find(new BasicDBObject(key, value)))
  }

  static function findMany(criteria : Map<String, Object>, collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find(new BasicDBObject(criteria)))
  }

  static function query(query : QueryBuilder, collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find(query.toQuery()))
  }

  static function all(collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find())
  }

  static function first(collection : String) : Document {
    var _collection = new MongoCollection(collection)
    return instantiate(_collection.findOne())
  }

  property get AllFields() : Set<String> {
    var keys = _obj.keySet()
    keys.remove('_id')
    keys.remove('intrinsic_type')
    return keys
  }

  /*
  ----------------------------Helper functions---------------------------------------
   */

  private final function shadowDiff() : BasicDBObject {
    var diff = new BasicDBObject()
    for (entry in _obj.entrySet()) {
      if (_shadow[entry.Key] == null || _shadow[entry.Key] != entry.Value) {
        diff.put(entry.Key, entry.Value)
      }
    }
    return diff
  }

  private final function reload(key = '_id', value = null) {
    if (key == '_id') _obj = _collection.findOne(new BasicDBObject(key, value as ObjectId))
    else _obj = _collection.findOne(new BasicDBObject(key, value ?: _id))
  }

  //Lazy instantation of the documents in order to prevent over consumption of memory
  private static function instantiateMany(documents : TransformIterable<BasicDBObject>) : SkipIterable<Document> {
    return new TransformIterable<Document>(documents.Cursor,\ d -> instantiate(d as BasicDBObject))
  }

  private static function instantiate(d : BasicDBObject) : Document {
    if (d == null) return null
    return Class.forName(d['intrinsic_type'] as String)
        .getConstructor({String.Type, Object.Type})
        .newInstance({'_id', d['_id'] as ObjectId}) as Document
  }

  private function query() : DBObject {
    return new BasicDBObject('_id', _id)
  }

}