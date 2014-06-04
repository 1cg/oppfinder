package jobs

uses java.lang.Runnable
uses java.lang.Thread
uses model.*
uses java.util.HashMap

class TestJob extends Job implements Runnable {

  override function run() {
    var dataSet = new DataSet("foo")
    var a = new Analysis()
    var iterations = 30
    for(var i in 1..iterations) {
      dataSet.insert(new HashMap())
      print("Test Job On Iteration ${i}")
      a.analyzeDataSet(dataSet)
      Thread.sleep(1 * 1000)
      this.Progress = i/iterations * 100
    }
    this.Progress = 100
    print("Test Job Complete")
  }

  static property get Active() : List<JobInfo> {
    return getActiveJobs()
  }
}