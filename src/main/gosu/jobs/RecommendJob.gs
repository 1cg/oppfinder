package jobs

uses java.util.Map
uses java.lang.Thread
uses model.DataSet
uses java.lang.Float
uses model.DataSetEntry
uses util.MahoutUtil
uses java.util.Arrays

class RecommendJob extends Job {

  static final var NUM_RECOMMENDATIONS = 20
  static final var NUM_BUCKETS = 4
  public static final var DELIMITER : String = ","
  var subJobs = {"recommender.LocationFieldImpl", "recommender.SizeFieldImpl", "recommender.ReachFieldImpl","recommender.RevenueFieldImpl"}
  var subJobsID : List<String> = {}
  final var SLEEP_TIME = 1000

  construct(data : Map<Object, Object> ) {
    super(data)
  }
/*
  construct() {
    super()
    update({'DataSetToAnalyze' -> DataSetEntry.COLLECTION})
  }
*/
  construct(dataSetName : String) {
    super()
    update({'DataSetToAnalyze' -> dataSetName})
  }

  override function executeJob() {
    checkCancellation()
    var dataSet = search('DataSetToAnalyze') as String
    startSubJobs(dataSet)
    this.StatusFeed = "Started Sub Jobs"
    poll() //Blocks until sub-tasks are complete
    this.StatusFeed = "Sub Jobs Complete"
    var recommendations : Map<String, Float>  = {}
    for (jobID in subJobsID) {
      var ds = new DataSet(jobID)
      for (companyRecommendations in ds.find() index i) {
        if (i % 200 == 0) checkCancellation()
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
    this.StatusFeed = "Recommendations Calculated"
    storeTopRecommendations(recommendations, dataSet)
    this.StatusFeed = "Recommendations Stored"
    this.StatusFeed = "Done"
  }

  /*
  * Runs each of the sub jobs that analyze the selected fields
   */
  function startSubJobs(dataSet : String) {
    var size = (new DataSet(dataSet).getCount({})+ NUM_BUCKETS-1)/NUM_BUCKETS
    for (jobName in subJobs) {
      for (i in 0..|NUM_BUCKETS) {
        var job = new RecommendSubJob(jobName,i * size, size, dataSet)
        job.start()
        subJobsID.add(job.UUId)
        if (Cancelled) return
      }
    }
    update({'SubJobs' -> subJobsID.toString()})
  }

  /*
  * Takes a set of recommendations and sorts them by the value (in decreasing order).
  * Those recommendations that are the strongest will be stored.
   */
  function storeTopRecommendations(recommendations : Map<String, Float>, dataSet : String) {
    var sorted = recommendations.entrySet().stream().sorted(Map.Entry.comparingByValue().reversed())
    checkCancellation()
    var finalResults : List<Map<Object, Object>>= {}
    var companyDB = new DataSet(dataSet)
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
    if (finalResults.size() > 0) {
      var ds = new DataSet('Results:'+UUId)
      for (result in finalResults.reverse()) {
       ds.insert(result)
      } // We unbatched this guy to prevent a race condition.
    }
  }

  property get ResultsData() : DataSet {
    var ds = new DataSet('Results:'+UUId)
    return ds
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
      var sum = 0
      checkCancellation()
      finished = true
      for (jobID in subJobsID) {
        var progress = Job.getUUIDProgress(jobID).remove("%").toInt()
        sum += progress
        if (progress < Job.MAX_PROGRESS_VALUE) {
          finished = false
        }
      }
      Progress = sum / subJobsID.size()
      if (finished) {
        return
      }
      Thread.sleep(SLEEP_TIME)
    }
  }

  property get SubJobs() : List<jobs.Job> {
    var stringArray = search('SubJobs') as String
    var array = Arrays.asList(stringArray.substring(1, stringArray.length() - 1).split(", "))
    return array.map(\ j -> newUp(j, 'jobs.RecommendSubJob'))
  }

}