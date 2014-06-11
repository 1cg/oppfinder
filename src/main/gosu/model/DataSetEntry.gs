package model

uses java.util.HashMap
uses java.util.Map
uses java.util.UUID
uses util.SkipIterator

class DataSetEntry {
  var myDataSet : DataSet
  var info : Map<Object, Object>

  construct(dataSetName : String) {
    myDataSet = new DataSet(dataSetName)
    info = new HashMap<String, Object>()
    info.put("UUID", UUID.randomUUID())
  }

  property set DataSet(dataSet : DataSet) {
    myDataSet.remove(info)
  }

  property get UUID() : UUID {
    return info.get("UUID") as UUID
  }

  static property get All() : SkipIterator<Map> {
    return new DataSet("oppFinder").find()
  }

  // Saves this company info into the mongo dataset
  function save() {
    myDataSet.insert(info)
    return
  }

  function delete() {
    myDataSet.remove(info)
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