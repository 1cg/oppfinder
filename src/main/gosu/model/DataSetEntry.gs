package model

uses java.util.HashMap
uses java.util.Map
uses util.SkipIterator

class DataSetEntry {

  public static var COLLECTION : String = "oppFinder"
  var myDataSet : DataSet
  var info : Map<Object, Object>

  construct() {
    myDataSet = new DataSet(COLLECTION)
    info = new HashMap<String, Object>()
  }

  static property get All() : SkipIterator<Map> {
    return new DataSet(COLLECTION).find()
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