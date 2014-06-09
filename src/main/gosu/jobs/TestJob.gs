package jobs

uses java.lang.Runnable
uses java.lang.Thread
uses model.*
uses java.util.HashMap
uses java.util.Map

class TestJob extends Job implements Runnable {

  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  override function run() {
    if (this.Cancelled) return
    var dataSet = new DataSet("foo")
    var a = new Analysis()
    var iterations = 30
    for(var i in 1..iterations) {
      if (this.Cancelled) return
      dataSet.insert(new HashMap())
      print("Test Job On Iteration ${i}")
      a.analyzeDataSet(dataSet)
      Thread.sleep(1 * 1000)
      this.Progress = (i * 100)/iterations
    }
    this.Progress = 100
    print("Test Job Complete")
  }

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }

}