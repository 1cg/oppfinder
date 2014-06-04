package jobs

uses java.lang.Runnable
uses java.lang.Thread
uses model.*
uses java.util.HashMap

class TestJob implements Runnable {

  override function run() {
    var db = new Database("test")
    var dataSet = db.getDataSet("foo")
    var a = new Analysis()
    for(var i in 1..30) {
      dataSet.insert(new HashMap())
      print("Test Job On Iteration ${i}")
      a.analyzeDataSet(dataSet)
      Thread.sleep(1 * 1000)
    }
    print("Test Job Done!")
  }
}