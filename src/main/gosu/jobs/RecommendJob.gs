package jobs

uses java.lang.Runnable
uses java.util.Map
uses java.lang.Thread
uses model.DataSet
uses java.lang.Float

class RecommendJob extends Job implements Runnable {

  var subJobs = {"recommender.LocationFieldImpl", "recommender.SizeFieldImpl"}//, "recommender.ReachFieldImpl","recommender.IndustryFieldImpl"}
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
    var recommendations : Map<String, Float>  = {}
    for (jobID in subJobsID) {
      for (companyRecommendations in new DataSet(jobID).find()) {
        companyRecommendations.remove('_id')
        var entry = companyRecommendations.entrySet().first()
        if (recommendations.containsKey(entry.Key)) {
          var value = recommendations.get(entry.Key)
          recommendations.put(entry.Key as String, (value + entry.Value as Float) / 2)
        } else {
          recommendations.put(entry.Key as String,entry.Value as Float)
        }
      }
    }
    this.Progress = 100
  }

  override function reset() {
    for (jobID in subJobsID) {
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