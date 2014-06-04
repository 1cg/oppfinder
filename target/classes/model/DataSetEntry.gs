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


  // Move this entry to a new dataset
  property set MyDataSet(newDataSet : DataSet) {
    myDataSet.remove(info)
    myDataSet = newDataSet
  }

  property get MyDataSet() : DataSet {
    return myDataSet
  }

  // Saves this company info into the mongo dataset
  function save() {
    myDataSet.insert(info)
    return
  }

  function delete() {
    myDataSet.remove(info)
  }

  // Wrapper, drops an entire DataSet
  static function deleteAllEntries(dataSet : DataSet) {
    dataSet.drop()
  }

  // put and get are for the child classes to update info
  protected function put (s : String, o : Object) {
    info.put(s, o)
  }

  protected function get (s : String) : Object {
    return info.get(s)
  }

}