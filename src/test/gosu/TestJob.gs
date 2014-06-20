uses java.lang.Thread
uses java.util.Map
uses jobs.Job

class TestJob extends Job {

  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  override function executeJob() {
    checkCancellation()
    var iterations = 30
    for(var i in 1..iterations) {
      checkCancellation()
      print("Test Job On Iteration ${i}")
      Thread.sleep(1 * 1000)
      this.Progress = (i * 100)/iterations
    }
    this.Progress = 100
    print("Test Job Complete")
  }

  override function reset() {}

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }

}