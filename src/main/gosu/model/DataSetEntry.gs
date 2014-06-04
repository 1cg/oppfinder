package model

uses java.util.HashMap
uses java.util.Map

/**
 * Created with IntelliJ IDEA.
 * User: jchoi
 * Date: 6/4/14
 * Time: 1:49 PM
 * To change this template use File | Settings | File Templates.
 */
class DataSetEntry {
  var myDataSet : DataSet
  var info : Map<String, Object>

  construct(dataSetName : String) {
    myDataSet = new DataSet(dataSetName)
    info = new HashMap<String, Object>()
  }

  property set DataSet(dataSet : DataSet) {
    myDataSet.remove(info)
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
  function put (s : String, o : Object) {
    info.put(s, o)
  }

  function get (s : String) : Object {
    return info.get(s)
  }

}