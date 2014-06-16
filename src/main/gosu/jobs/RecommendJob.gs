package jobs

uses java.lang.Runnable
uses java.util.Map
uses java.lang.Thread
uses model.DataSet
uses java.lang.Float
uses model.DataSetEntry
uses util.MahoutUtil

class RecommendJob extends Job implements Runnable {

  static final var NUM_RECOMMENDATIONS = 20
  static final var NUM_BUCKETS = 6
  public static final var DELIMITER : String = ","
  var subJobs = {/*"recommender.LocationFieldImpl", "recommender.SizeFieldImpl", "recommender.ReachFieldImpl",*/"recommender.RevenueFieldImpl"}
  var subJobsID : List<String> = {}
  final var SLEEP_TIME = 1000

  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  override function run() {
    print("starting recommend job")
    if (Cancelled) return
    startSubJobs()
    poll() //Blocks until sub-tasks are complete
    if (Cancelled) return
    var recommendations : Map<String, Float>  = {}
    for (jobID in subJobsID) {
      var ds = new DataSet(jobID)
      for (companyRecommendations in ds.find()) {
        companyRecommendations.remove('_id')
        var entry = companyRecommendations.entrySet().first()
        if (recommendations.containsKey(entry.Key)) {
          var value = recommendations.get(entry.Key)
          recommendations.put(entry.Key as String, (value + (entry.Value as Float)) / 2)
        } else {
          recommendations.put(entry.Key as String,entry.Value as Float)
        }
      }
      ds.drop() //Get rid of the temp data
    }
    storeTopRecommendations(recommendations)
    this.Progress = 100
  }

  /*
  * Runs each of the sub jobs that analyze the selected fields
   */
  function startSubJobs() {
    var size = (new DataSet(DataSetEntry.COLLECTION).getCount({})+ NUM_BUCKETS-1)/NUM_BUCKETS
    for (jobName in subJobs) {
      for (i in 0..|NUM_BUCKETS) {
        var job = new RecommendSubJob(jobName, i * size, size)
        job.start()
        subJobsID.add(job.UUId)
        if (Cancelled) return
      }
    }
  }

  /*
  * Takes a set of recommendations and sorts them by the value (in decreasing order).
  * Those recommendations that are the strongest will be stored.
   */
  function storeTopRecommendations(recommendations : Map<String, Float>) {
    var sorted = recommendations.entrySet().stream().sorted(Map.Entry.comparingByValue().reversed())
    var finalResults : List<Map<Object, Object>>= {}
    var companyDB = new DataSet(DataSetEntry.COLLECTION)
    for (each in sorted.iterator() index i) {
      if (i == NUM_RECOMMENDATIONS) break
      var result : Map<Object, Object> = {}
      var info = each.Key.split(DELIMITER)
      var company = companyDB.find({'longID' -> info[0].toLong()},{'Company' -> 1}).next()
      result.put('Company', company['Company'])
      result.put('Policy',MahoutUtil.longToPolicy(info[1].toLong()))
      result.put('Value', each.Value)
      finalResults.add(result)
    }
    new DataSet('Results:'+UUId).insert(finalResults.reverse())
  }

  property get ResultsData() : DataSet {
    return new DataSet('Results:'+UUId)
  }

  /*
  * Cleans up the database by removing the temp data from the sub jobs
   */
  override function reset() {
    for (jobID in subJobsID) {
      new DataSet(jobID).drop()
    }
  }

  override function renderToString() : String {
    return view.RecommendJob.renderToString(this)
  }

  /*
  * Periodically checks the database to see if all of the sub jobs have completed
   */
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