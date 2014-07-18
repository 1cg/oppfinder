package jobs

uses java.util.Map
uses java.lang.Thread
uses model.MongoCollection
uses java.lang.Float
uses util.MahoutUtil
uses java.util.Arrays
uses util.iterable.SkipIterable
uses model.Results

class RecommendJob extends Job {

  static final var NUM_RECOMMENDATIONS = 10
  static final var NUM_BUCKETS = 4
  public static final var DELIMITER : String = ","
  var subJobs = {"recommender.LocationFieldImpl", "recommender.SizeFieldImpl", "recommender.ReachFieldImpl","recommender.RevenueFieldImpl"}
  var subJobsID : List<String> = {}
  final var SLEEP_TIME = 1000

  construct(key : String, value : String) {
    super(key,value)
  }

  construct() {
    super()
  }

  property get DataSetCollection() : String {
    return getField('DataSetCollection') as String
  }

  property set DataSetCollection(collection : String) {
    upsert('DataSetCollection', collection)
  }

  override function executeJob() {
    checkCancellation()
    var dataSet = DataSetCollection
    startSubJobs(dataSet)
    StatusFeed = "Started Sub Jobs"
    poll() //Blocks until sub-tasks are complete
    StatusFeed = "Sub Jobs Complete"
    save()
    var recommendations : Map<String, Float>  = {}
    for (jobID in subJobsID) {
      var ds = new MongoCollection(jobID)
      for (companyRecommendations in ds?.find().map(\ o -> (o as Map<String, Object>)) index i) {
        if (i % 200 == 0) checkCancellation()
        companyRecommendations.remove('_id')
        var entry = companyRecommendations.entrySet().first()
        if (recommendations.containsKey(entry.Key)) {
          var value = recommendations.get(entry.Key)
          recommendations.put(entry.Key, (value + (entry.Value as Float)) / 2)
        } else {
          recommendations.put(entry.Key,entry.Value as Float)
        }
      }
      ds.drop() //Get rid of the temp data
    }
    StatusFeed = "Recommendations Calculated"
    save()
    storeTopRecommendations(recommendations, dataSet)
    this.StatusFeed = "Recommendations Stored: <a href=/results/${UUId}><strong>See Results!</strong></a>"
    this.StatusFeed = "Done"
    save()
  }

  /*
  * Runs each of the sub jobs that analyze the selected fields
   */
  function startSubJobs(dataSet : String) {
    var size = (new MongoCollection (dataSet).getCount({})+ NUM_BUCKETS-1)/NUM_BUCKETS
    for (jobName in subJobs) {
      for (i in 0..|NUM_BUCKETS) {
        var job = new RecommendSubJob(jobName,i * size, size, dataSet)
        job.start()
        subJobsID.add(job.UUId)
        checkCancellation()
      }
    }
    upsert('SubJobs', subJobsID.toString())
    save()
  }

  /*
  * Takes a set of recommendations and sorts them by the value (in decreasing order).
  * Those recommendations that are the strongest will be stored.
   */
  function storeTopRecommendations(recommendations : Map<String, Float>, dataSet : String) {
    var sorted = recommendations.entrySet().stream().sorted(Map.Entry.comparingByValue().reversed())
    checkCancellation()
    //TODO --Make a real Result object
    var finalResults : List<Map<Object, Object>>= {}
    var companyDB = new MongoCollection (dataSet)
    for (each in sorted.iterator() index i) {
      if (i == NUM_RECOMMENDATIONS) break
      var result : Map<Object, Object> = {}
      var info = each.Key.split(DELIMITER)
      var company = companyDB.find({'longID' -> info[0].toLong()},{'Company' -> 1}).iterator().next()
      result.put('Company', company['Company'])
      result.put('Policy',MahoutUtil.longToPolicy(info[1].toLong()))
      result.put('Value', String.format('%.3g%n',{each.Value}))
      finalResults.add(result)
    }
    Results.addResults(UUId, finalResults, dataSet)
  }

  /*
  * Cleans up the database by removing the temp data from the sub jobs
   */
  override function doReset() {
    for (jobID in subJobsID) {
      new MongoCollection(jobID)?.drop()
    }
  }

  override function delete() {
    super.delete()
    for (job in SubJobs) {
      job?.delete()
    }
  }

  override function renderToString() : String {
    return view.jobs.drilldowns.RecommendJob.renderToString(this)
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
        var progress = Job.findJob(jobID)?.Progress
        sum += progress
        if (progress < Job.MAX_PROGRESS_VALUE) {
          finished = false
        }
      }
      var progress = sum / subJobsID.size()
      if (progress > 0) Progress = progress
      if (finished) {
        return
      }
      Thread.sleep(SLEEP_TIME)
    }
  }

  property get SubJobs() : SkipIterable<jobs.Job> {
    var stringArray = getField('SubJobs') as String
    if (stringArray != null) {
      var array = Arrays.asList(stringArray?.substring(1, stringArray.length() - 1)?.split(", "))
      return Job.findByIDs(array)
    }
    return null
  }

  override property set Cancelled(status : boolean) {
    super.Cancelled = status
    for (job in SubJobs) {
      job?.delete()
    }
    upsert('SubJobs', null)
    save()
  }

}