package model.database

uses java.util.Map
uses java.lang.Class
uses java.util.Set
uses util.inflector.Inflector
uses model.database.iterable.SkipIterable
uses model.database.iterable.TransformIterable

/*
 * The Document supports multiple database systems. MongoDatabase is the only current implementation
 * of the Database adapter, but the api has been made sufficiently generic to support a SQL database system
 * such as MySQL. The database implementation is available through the Database property for in order to allow
 * for complex queries towards specific database implementations, although use of this should be limited
 * to avoid coupling to implementations.
 */
abstract class Document {

  //===================================================================
  // Private Fields
  //===================================================================

  var _obj : Map<String, Object>
  var _shadow : Map<String, Object>
  var _id : ID
  var _dataSet: DataSet
  var _inserted: boolean as readonly Persisted
  static var _database : MongoDatabase as Database = MongoDatabase.INSTANCE
  static final var TYPE_FIELD = 'intrinsic_type'

  //===================================================================
  // Constructors
  //===================================================================

  /*
  * If no name is supplied, then inflection is used to construct the plural form of the class name
   */
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

  /*
  * If no name is supplied, then inflection is used to construct the plural form of the class name
   */
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

  //===================================================================
  // Public Methods
  //===================================================================

  /*
   * Saves the key (column name), value (row value) pair into memory. The change is not pushed
   * to the database until the save() method is called
   */
  final function put(key: String, value: Object) {
    _obj.put(key, value)
  }

  /*
   * Saves the key (column name), value (row value) pairs into memory. The change is not pushed
   * to the database until the save() method is called
   */
  final function putAll(upserts: Map<String, Object>) {
    _obj.putAll(upserts)
  }

  /*
   * Gets the value from memory based on the key (column name). There is no guarantee given that
   * this data is not stale. The data is only as recent as the last time the reload() method was called.
   * The reload method is called at instantiation of the document when initially loading from the database
   * into memory
   */
  final function get(key : String) : Object {
    return _obj[key]
  }

  /*
   * Deletes the object from memory. A guarantee that this operation succeeds is specific to the
   * database implementation.
   */
  function delete() {
    _dataSet.remove(_database.IDName, _id.ID)
    _inserted = false
  }

  /*
   * Increments the row value for the specified column name
   */
  final function increment(field : String, by = 1) {
    _dataSet.increment(query(), {field -> by})
  }

  /*
   * Decrements the row value for the specified column name
   */
  final function decrement(field : String, by = 1) {
    increment(field, by*-1)
  }

  /*
   * Saves the document (row) to the database. If the document has not yet been added to the
   * database, it will be inserted as a new document (row). Otherwise, only changed values will
   * be pushed to the database to be updated.
   */
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

  /*
   * Pulls fresh data from the database. If the key (column name), value (row value) pair
   * supplied is not unique, the specific document (row) returned is undefined.
   */
  final function reload(key : String = null, value = null) {
    if (key == _database.IDName) value = (value as ID).ID
    _obj = _dataSet.findOne({key ?: _database.IDName ->  value ?: _id.ID})
  }

  //===================================================================
  //Finders
  //===================================================================

  /*
   * Finds the document (row) that matches the key (column name) value (row value) pair. If there
   * are multiple documents (rows) that match, then which object is returned is undefined (or
   * at the very least implementation specific)
   */
  static function find(key : String, value : Object, dataSetName: String) : Document {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiate(dataSet.findOne({key -> value}))
  }

  /*
   * Finds the documents (rows) that match the key (column name) value (row value) pair.
   */
  static function findMany(key : String, value : Object, dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.find({key -> value}))
  }

  /*
   * Finds the documents (rows) that match the key (column name) value (row value) pairs specified.
   */
  static function findMany(criteria : Map<String, Object>, dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.find(criteria))
  }

  /*
   * Finds the documents (rows) in the database
   */
  static function all(dataSetName: String) : SkipIterable<Document> {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiateMany(dataSet.all())
  }

  /*
   * Returns the newest document (row) in the database
   */
  static function first(dataSetName: String) : Document {
    var dataSet = _database.getDataSet(dataSetName)
    return instantiate(dataSet.first())
  }

  /*
   * Returns all fields (column names) in the object. Added metadata is stripped from the returned
   * set of values.
   */
  property get AllFields() : Set<String> {
    var keys = _obj.keySet()
    keys.remove(_dataSet.IDName)
    keys.remove(TYPE_FIELD)
    return keys
  }

  //===================================================================
  // Helper Functions
  //===================================================================

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