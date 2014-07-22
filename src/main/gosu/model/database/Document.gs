package model.database

uses java.util.Map
uses util.iterable.SkipIterable
uses util.iterable.TransformIterable
uses java.lang.Class
uses java.util.Set
uses com.mongodb.BasicDBObject
uses com.mongodb.DBObject
uses util.inflector.Inflector
uses java.lang.Integer
uses org.bson.types.ObjectId

abstract class Document {

  var _obj : BasicDBObject
  var _id : ObjectId //Unique ID. This would be the primary key in a SQL database or a unique document ID in MongoDB
  var _collection : MongoCollection
  var inserted : boolean as readonly Persisted

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct() {
    _obj = new BasicDBObject()
    _collection = new MongoCollection(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    inserted = false
  }

  construct(collection : String) {
    _obj = new BasicDBObject()
    _collection = new MongoCollection(collection)
    inserted = false
  }

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct(key : String, value : Object) {
    _collection = new MongoCollection(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    reload(key, value)
    _id = _obj['_id'] as ObjectId
    inserted = true
  }

  construct(collection : String, key : String, value : Object) {
    _collection = new MongoCollection(collection)
    reload(key, value)
    _id = _obj['_id'] as ObjectId
    inserted = true
  }

  final function put(key: String, value: Object) {
    _obj.put(key, value)
  }

  final function putAndSave(key: String, value: Object) {
    _obj.put(key, value)
    save()
  }

  final function putAll(upserts: Map<String, Object>) {
    _obj.putAll(upserts)
  }

  final function putAllAndSave(upserts: Map<String, Object>) {
    _obj.putAll(upserts)
    save()
  }

  final function get(value: String) : Object {
    return _obj[value]
  }

  function delete() {
    _collection.remove('_id',_id)
    inserted = false
  }

  function increment(field : String, by = 1) {
    _collection.increment(query(), new BasicDBObject(field, by))
  }

  function decrement(field : String, by = 1) {
    increment(field, by*-1)
  }

  final function save() {
    if (inserted) {
      _collection.update(query(), _obj)
    } else {
      _obj['intrinsic_type'] = this.IntrinsicType.Name
      _id = _collection.insert(_obj)
      inserted = true
    }
  }

  final function reload(key = '_id', value = null) {
    if (key == '_id') _obj = _collection.findOne(new BasicDBObject(key, value as ObjectId))
    else _obj = _collection.findOne(new BasicDBObject(key, value ?: _id))
  }

  static function find(key : String, value : Object, collection : String) : Document {
    var _collection = new MongoCollection(collection)
    return instantiate(_collection.findOne(new BasicDBObject(key, value)))
  }

  static function find(criteria : Map<String, Object>, collection : String) : Document {
    var _collection = new MongoCollection(collection)
    return instantiate(_collection.findOne(new BasicDBObject(criteria)))
  }

  static function findMany(key : String, value : Object, collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find(new BasicDBObject(key, value)))
  }

  static function findMany(criteria : Map<String, Object>, collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find(new BasicDBObject(criteria)))
  }

  static function all(collection : String) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    return instantiateMany(_collection.find())
  }

  static function all(collection : String, fields : List<String>) : SkipIterable<Document> {
    var _collection = new MongoCollection(collection)
    var map : Map<String, Integer> = {}
    for (field in fields) {
      map.put(field, 1)
    }
    return instantiateMany(_collection.find({}, map))
  }

  static function first(collection : String) : Document {
    var _collection = new MongoCollection(collection)
    return instantiate(_collection.findOne())
  }

  protected static function instantiateMany(documents : TransformIterable<BasicDBObject>) : SkipIterable<Document> {
    return new TransformIterable<Document>(documents.Cursor,\ d -> instantiate(d as BasicDBObject))
  }

  protected static function instantiate(d : BasicDBObject) : Document {
    if (d == null) return null
    return Class.forName(d['intrinsic_type'] as String)
    .getConstructor({String.Type, Object.Type})
        .newInstance({'_id', d['_id'] as ObjectId}) as Document
  }

  property get AllFields() : Set<String> {
    var keys = _obj.keySet()
    keys.remove('_id')
    keys.remove('intrinsic_type')
    return keys
  }

  private function query() : DBObject {
    return new BasicDBObject('_id', _id)
  }

}