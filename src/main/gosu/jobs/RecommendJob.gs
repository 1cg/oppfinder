package jobs

uses java.util.Map
uses java.lang.Thread
uses util.Mahout
uses util.iterable.SkipIterable
uses model.ResultInfo
uses model.Result
uses java.util.Collection
uses model.Company
uses model.database.Document
uses com.google.gson.Gson
uses com.google.gson.reflect.TypeToken
uses model.DataSetInfo

class RecommendJob extends Job {

  static final var NUM_RECOMMENDATIONS = 10
  static final var NUM_BUCKETS = 4
  public static final var DELIMITER : String = ","
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
    startSubJobs()
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
      storeTopRecommendations(recommendations.Values)
      this.StatusFeed = "Recommendations Stored: <a href=/results/${UUId}><strong>See Results!</strong></a>"
      this.StatusFeed = "Done"
      save()
    }
  }

  /*
  * Runs each of the sub jobs that analyze the selected fields
   */
  private function startSubJobs() {
    var size = (Document.findMany(Company.ForeignName, DataSetCollection, Company.Collection).Count + NUM_BUCKETS-1)/NUM_BUCKETS
    var fields = Fields ?: DataSetInfo.findDS(DataSetCollection).AnalyzableFields
    for (field in fields) {
      for (i in 0..|NUM_BUCKETS) {
        var job = new RecommendSubJob(field, i * size, size, DataSetCollection)
        job.start()
        subJobsID.add(job.UUId)
        checkCancellation()
      }
    }
    put('SubJobs', subJobsID.toJSON())
    save()
  }

  /*
  * Takes a set of recommendations and sorts them by the value (in decreasing order).
  * Those recommendations that are the strongest will be stored.
   */
  private function storeTopRecommendations(recommendations : Collection<Result>) {
    var sorted = recommendations.orderByDescending(\ o -> o.Value).subList(0,NUM_RECOMMENDATIONS)
    checkCancellation()
    var finalResults : List<Result>= {}
    var policies = Mahout.makePolicyMap(DataSetInfo.findDS(DataSetCollection).Policies)
    for (result in sorted) {
      result.Value = String.format('%.3g%n',{result.Value}).toFloat()
      result.ResultSet = UUId
      var company = Company.findByID(result.User)
      result.Company = company.get('Company') as String
      result.put('Policy', Mahout.longToPolicy(policies, result.ItemID))
      result.save()
    }
    var owner = get("Owner") as String
    ResultInfo.addResults(UUId, DataSetCollection, owner)
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
      save()
      if (finished) {
        return
      }
      Thread.sleep(SLEEP_TIME)
    }
  }

  property get SubJobs() : SkipIterable<jobs.Job> {
    var UUIDs : List<String> = new Gson().fromJson(get('SubJobs') as String, new TypeToken<List<String>>(){}.getType())
    return Job.findByIDs(UUIDs)
  }

  override property set Cancelled(status : boolean) {
    super.Cancelled = status
    for (job in SubJobs) {
      job?.delete()
    }
    put('SubJobs', null)
    save()
  }

  property get Fields() : List<String> {
    return new Gson().fromJson(get('Fields') as String, new TypeToken<List<String>>(){}.getType())
  }

  property set Fields(fields : List<String>) {
    put('Fields', fields?.toJSON())
  }

}