package jobs

uses java.util.Map
uses java.lang.Thread
uses util.MahoutUtil
uses java.util.Arrays
uses util.iterable.SkipIterable
uses model.ResultInfo
uses model.Result
uses java.util.Collection
uses model.Company
uses model.database.Document

class RecommendJob extends Job {

  static final var NUM_RECOMMENDATIONS = 10
  static final var NUM_BUCKETS = 4
  public static final var DELIMITER : String = ","
  var subJobs = {"recommender.LocationFieldImpl", "recommender.SizeFieldImpl", "recommender.ReachFieldImpl","recommender.RevenueFieldImpl"}
  var subJobsID : List<String> = {}
  final var SLEEP_TIME = 1000

  construct(key : String, value : Object) {
    super(key,value)
  }

  construct() {
    super()
  }

  property get DataSetCollection() : String {
    return get('DataSetCollection') as String
  }

  property set DataSetCollection(collection : String) {
    put('DataSetCollection', collection)
  }

  override function executeJob() {
    checkCancellation()
    var dataSet = DataSetCollection
    startSubJobs(dataSet)
    StatusFeed = "Started Sub Jobs"
    poll() //Blocks until sub-tasks are complete
    StatusFeed = "Sub Jobs Complete"
    save()
    var recommendations : Map<String, Result>  = {}
    for (jobID in subJobsID) {
      for (result in Result.find(jobID) index i) {
        if (i % 200 == 0) checkCancellation()
        if (recommendations.containsKey(result.Key)) {
          result.Value = (recommendations.get(result.Key).Value + result.Value) / 2
          recommendations.put(result.Key, result)
        } else {
          recommendations.put(result.Key,result)
        }
        result.delete()
      }
    }
    StatusFeed = "Recommendations Calculated"
    save()
    if (recommendations.Count == 0) {
      this.StatusFeed = "No recommendations found"
      save()
    } else {
      storeTopRecommendations(recommendations.Values, dataSet)
      this.StatusFeed = "Recommendations Stored: <a href=/results/${UUId}><strong>See Results!</strong></a>"
      this.StatusFeed = "Done"
      save()
    }
  }

  /*
  * Runs each of the sub jobs that analyze the selected fields
   */
  function startSubJobs(dataSet : String) {
    var size = (Document.findMany(Company.ForeignName, dataSet, Company.Collection).Count + NUM_BUCKETS-1)/NUM_BUCKETS
    for (jobName in subJobs) {
      for (i in 0..|NUM_BUCKETS) {
        var job = new RecommendSubJob(jobName,i * size, size, dataSet)
        job.start()
        subJobsID.add(job.UUId)
        checkCancellation()
      }
    }
    put('SubJobs', subJobsID.toString())
    save()
  }

  /*
  * Takes a set of recommendations and sorts them by the value (in decreasing order).
  * Those recommendations that are the strongest will be stored.
   */
  function storeTopRecommendations(recommendations : Collection<Result>, dataSet : String) {
    var sorted = recommendations.orderByDescending(\ o -> o.Value).subList(0,NUM_RECOMMENDATIONS).reverse()
    checkCancellation()
    var finalResults : List<Result>= {}
    for (result in sorted) {
      result.Value = String.format('%.3g%n',{result.Value}).toFloat()
      result.ResultSet = UUId
      var company = Company.findByID(result.User)
      result.Company = company.get('Company') as String
      result.put('Policy', MahoutUtil.longToPolicy(result.ItemID))
      result.save()
    }
    print(Document.all('results').Count)
    ResultInfo.addResults(UUId, dataSet)
  }

  /*
  * Cleans up the database by removing the temp data from the sub jobs
   */
  override function doReset() {
    for (jobID in subJobsID) {
      var results = ResultInfo.findResults(jobID)
      for (result in results) {
        result.delete()
      }
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
      if (progress > 0 && progress != 100) Progress = progress
      if (finished) {
        return
      }
      Thread.sleep(SLEEP_TIME)
    }
  }

  property get SubJobs() : SkipIterable<jobs.Job> {
    var stringArray = get('SubJobs') as String
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
    put('SubJobs', null)
    save()
  }

}