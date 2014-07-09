package model

uses java.util.HashMap
uses java.util.Map
uses util.iterable.SkipIterable
uses java.text.SimpleDateFormat
uses util.TimeUtil

class DataSet {

  public static var REGIONCOORDINATES : String = "regionCoordinates"
  public static var MASTER_DATA_SET : String = "masterDataSet" // MongoCollection of DataSets to refer to
  var myDataSet : MongoCollection
  var info : Map<Object, Object>
  var collection : String

  construct(_collection : String) {
    collection = _collection
    myDataSet = new MongoCollection (collection)
    var sdf = new SimpleDateFormat("MMM d, 'at' h:mm a")
    new MongoCollection (MASTER_DATA_SET).insert({"name" -> collection,
                                                  "size" -> myDataSet.Count,
                                                  "created" -> TimeUtil.now()})
    info = new HashMap<String, Object>()
  }

  static function all(_collection : String = "defaultDataSet") : SkipIterable<Map> {
    return new MongoCollection (_collection).find()
  }

  static property get allDataSets() : SkipIterable<Map<Object,Object>> {
    return new MongoCollection(MASTER_DATA_SET).find()
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
  protected function put (s : Object, o : Object) {
    info.put(s, o)
  }

  protected function get (s : Object) : Object {
    return info.get(s)
  }

}