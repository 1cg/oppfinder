package model

uses java.util.HashMap
uses java.util.Map
uses util.SkipIterable

class DataSetEntry {

  public static var REGIONCOORDINATES : String = "regionCoordinates"
  public static var MASTER_DATA_SET : String = "masterDataSet" // DataSet of DataSets to refer to
  var myDataSet : DataSet
  var info : Map<Object, Object>
  var collection : String

  construct() {
    collection = "defaultDataSet"
    myDataSet = new DataSet(collection)
    new DataSet(MASTER_DATA_SET).insert({"name" -> collection})
    info = new HashMap<String, Object>()
  }

  construct(_collection : String) {
    collection = _collection
    myDataSet = new DataSet(collection)
    new DataSet(MASTER_DATA_SET).insert({"name" -> collection})
    info = new HashMap<String, Object>()
  }

  static function All(_collection : String = "defaultDataSet") : SkipIterable<Map> {
    return new DataSet(_collection).find()
  }

  static function AllDataSets() : List<String> {
    var ds = new DataSet(MASTER_DATA_SET).find()
    return ds.toList().map(\ o -> o['name'] as String)
  }

  static function FindDataSet(id : String) : SkipIterable<Map> {
    var ds = new DataSet(MASTER_DATA_SET).find()
    var iter = ds?.iterator()
    while (iter?.hasNext()) {
      var n = iter?.next()
      if (n.get('name') as String == id) {
        return All(n.get('name') as String)
      }
    }
    return null
  }

  static property get MostRecentDataSet() : SkipIterable<Map> {
    var ds = new DataSet(MASTER_DATA_SET).find()
    return ds?.iterator()?.hasNext() ? All(ds.iterator().next().get('name') as String) : null
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