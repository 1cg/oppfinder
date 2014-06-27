package model

uses java.util.HashMap
uses java.util.Map
uses util.SkipIterator

class DataSetEntry {

  public static var REGIONCOORDINATES : String = "regionCoordinates"
  public static var MASTER_DATA_SET : String = "masterDataSet" // DataSet of DataSets to refer to
  public static var CURRENT_DATA_SET_REF : String = "currentDataSetReference" // Stored in Master. Pls don't name any datasets with this string
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

  static function All(_collection : String = "defaultDataSet") : SkipIterator<Map> {
    return new DataSet(_collection).find()
  }

  static function AllDataSets() : List<String> {
    var ds = new DataSet(MASTER_DATA_SET).find()
    var returnList : List<String> = {}
    while (ds.hasNext()) {
      returnList.add(ds.next().get('name') as String)
    }
    return returnList
  }

  static property get MostRecentDataSet() : SkipIterator<Map> {
    var ds = new DataSet(MASTER_DATA_SET).find()
    if (ds.hasNext()) {
      return All(ds.next().get('name') as String)
    }
    return null
  }

  // Saves this company info into the mongo dataset
  function save() {
    myDataSet.insert(info)
    return
  }

  static function deleteAllEntries(dataSet : DataSet) {
    dataSet.drop()
  }

  // put and get are for the child classes to update info
  protected function put (s : Object, o : Object) {
    info.put(s, o)
  }

  protected function get (s : Object) : Object {
    return info.get(s)
  }

}