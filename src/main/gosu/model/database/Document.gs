package model.database

uses java.util.Map
uses java.lang.Class
uses java.util.Set
uses util.inflector.Inflector
uses com.mongodb.QueryBuilder
uses model.database.iterable.SkipIterable
uses model.database.iterable.TransformIterable

abstract class Document {

  /*
    -------Private Fields-------------------------------------------------
   */

  var _obj : Map<String, Object>
  var _shadow : Map<String, Object>
  var _id : ID
  var _dataSet: DataSet
  var _inserted: boolean as readonly Persisted
  static final var _database : MongoDatabase = MongoDatabase.INSTANCE
  static final var TYPE_FIELD = 'intrinsic_type'

  /*
   -------------Constructors----------------------------------------------
   */

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct() {
    _obj = {}
    _dataSet = _database.getDataSet(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    _inserted = false
  }

  construct(collection : String) {
    _obj = {}
    _dataSet = _database.getDataSet(collection)
    _inserted = false
  }

  //If no name is supplied, the name of the data source is assumed to be the plural of the name of the class
  construct(key : String, value : Object) {
    _dataSet = _database.getDataSet(Inflector.pluralize(this.IntrinsicType.TypeInfo.Name).toLowerCase())
    reload(key, value)
    _shadow = {}
    _shadow.putAll(_obj)
    _id = new ID(_obj[_database.IDName])
    _inserted = true
  }

  construct(collection : String, key : String, value : Object) {
    _dataSet = _database.getDataSet(collection)
    reload(key, value)
    _shadow = {}
    _shadow.putAll(_obj)
    _id = new ID(_obj[_database.IDName])
    _inserted = true
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
    _dataSet.remove(_database.IDName, _id.ID)
    _inserted = false
  }

  final function increment(field : String, by = 1) {
    _dataSet.increment(query(), {field -> by})
  }

  final function decrement(field : String, by = 1) {
    increment(field, by*-1)
  }

  final function save() {
    if (_inserted) {
      _dataSet.update(query(), shadowDiff())
    } else {
      _obj[TYPE_FIELD] = this.IntrinsicType.Name
      _id = _dataSet.insert(_obj)
      _shadow = {}
      _shadow.putAll(_obj)
      _inserted = true
    }
  }

  final function reload(key : String = null, value = null) {
    if (key == _database.IDName) value = (value as ID).ID
    _obj = _dataSet.findOne({key ?: _database.IDName ->  value ?: _id.ID})
  }

  /*
  ---------------------Finders------------------------------------------------
   */

  static function find(key : String, value : Object, dataSetName: String) : Document {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiate(dataSet.findOne({key -> value}))
  }

  static function findMany(key : String, value : Object, dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.find({key -> value}))
  }

  static function findMany(criteria : Map<String, Object>, dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.find(criteria))
  }

  static function query(query : QueryBuilder, dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.find(query.toQuery()))
  }

  static function all(dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.all())
  }

  static function first(dataSetName: String) : Document {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiate(dataSet.first())
  }

  property get AllFields() : Set<String> {
    var keys = _obj.keySet()
    keys.remove(_dataSet.IDName)
    keys.remove(TYPE_FIELD)
    return keys
  }

  /*
  ----------------------------Helper functions---------------------------------------
   */

  private final function shadowDiff() : Map<String, Object> {
    var diff : Map<String, Object> = {}
    for (entry in _obj.entrySet()) {
      if (_shadow[entry.Key] == null || _shadow[entry.Key] != entry.Value) {
        diff.put(entry.Key, entry.Value)
      }
    }
    return diff
  }

  //Lazy instantation of the documents in order to prevent over consumption of memory
  private static function instantiateMany(documents : SkipIterable<Map<String,Object>>) : SkipIterable<Document> {
    return new TransformIterable<Document>(documents.Cursor,\ d -> instantiate(d as Map<String, Object>))
  }

  private static function instantiate(d : Map<String,Object>) : Document {
    if (d == null) return null
    return Class.forName(d[TYPE_FIELD] as String)
        .getConstructor({String.Type, Object.Type})
        .newInstance({_database.IDName, new ID(d[_database.IDName])}) as Document
  }

  private function query() : Map<String, Object> {
    return {_database.IDName -> _id.ID}
  }

}