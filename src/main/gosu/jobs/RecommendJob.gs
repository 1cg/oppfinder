package jobs

uses java.lang.Runnable
uses java.util.Map
uses java.lang.Thread
uses model.DataSet

class RecommendJob extends Job implements Runnable {

  var subJobs = {"LocationFieldImpl, IndustryFieldImpl, SizeFieldImpl, ReachFieldImpl"}
  var subJobsID : List<String> = {}
  final var SLEEP_TIME = 1000

  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  override function run() {
    if (Cancelled) return
    for (jobName in subJobs) {
      var job = new RecommendSubJob(jobName)
      job.start()
      subJobsID.add(job.UUId)
      if (Cancelled) return
    }
    poll() //Blocks until sub-tasks are complete
    if (Cancelled) return
    for (jobID in subJobsID) {
      var dataSet = new DataSet("oppFinder")
    }
  }

  override function reset() {
    for (jobID in subJobsID) {
      Job.cancel(jobID)
      new DataSet(jobID).drop()
    }
  }

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }

  function poll() {
    var finished = false
    while (true) {
      if (Cancelled) {
        return
      }
      finished = true
      for (jobID in subJobsID) {
        if (Job.getUUIDProgress(jobID) < Job.MAX_PROGRESS_VALUE) {
          finished = false
          break
        }
      }
      if (finished) {
        return
      }
      Thread.sleep(SLEEP_TIME)
    }
  }

}