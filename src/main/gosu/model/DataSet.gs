package model

uses java.util.HashMap
uses java.util.Map
uses util.iterable.SkipIterable
uses util.TimeUtil
uses util.iterable.TransformIterable
uses com.mongodb.BasicDBObject
uses model.database.MongoCollection

class DataSet {

  public static var REGION_COORDINATES : String = "regionCoordinates"
  public static var MASTER_DATA_SET : String = "masterDataSet" // MongoCollection of DataSets to refer to
  var myDataSet : MongoCollection
  var info : Map<String, Object>
  var collection : String

  construct(_collection : String) {
    collection = _collection
    myDataSet = new MongoCollection (collection)
    new MongoCollection (MASTER_DATA_SET).insert({"name" -> collection,
                                                  "size" -> myDataSet.Count,
                                                  "created" -> TimeUtil.now()})
    info = new HashMap<String, Object>()
  }

  //TODO --FIX THIS
  static function all(_collection : String = "defaultDataSet") : SkipIterable<Map<String,Object>> {
    return new TransformIterable<Map<String,Object>>(new MongoCollection (_collection).find().Cursor, \o -> (o as BasicDBObject))
  }

  //TODO --FIX THIS
  static property get allDataSets() : SkipIterable<Map<Object,Object>> {
    return new TransformIterable<Map<String,Object>>(new MongoCollection(MASTER_DATA_SET).find().Cursor, \o -> (o as BasicDBObject))
  }

  static property get AllDataSets() : List<String> {
    return new MongoCollection(MASTER_DATA_SET).find().map(\ o -> o['name'] as String)
  }

  static function find(id : String) : SkipIterable<Map> {
    var ds = new MongoCollection (MASTER_DATA_SET).find()
    var iter = ds?.iterator()
    while (iter?.hasNext()) {
      var n = iter?.next()
      if (n.get('name') as String == id) {
        return all(n.get('name') as String)
      }
    }
    return null
  }

  static property get mostRecentDataSet() : SkipIterable<Map> {
    var ds = new MongoCollection (MASTER_DATA_SET).find()
    return ds?.iterator()?.hasNext() ? all(ds.iterator().next().get('name') as String) : null
  }

  // Saves this company info into the mongo dataset
  function save() {
    myDataSet.insert(info)
    return
  }

  // put and get are for the child classes to update info
  protected function put (s : String, o : Object) {
    info.put(s, o)
  }

  protected function get (s : Object) : Object {
    return info.get(s)
  }

}