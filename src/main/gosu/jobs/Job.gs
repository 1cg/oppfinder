package jobs

uses net.greghaines.jesque.Job
uses java.lang.Runnable
uses java.util.UUID
uses java.lang.System
uses java.lang.Integer
uses java.lang.Long
uses java.lang.Thread
uses java.lang.Exception
uses util.CancellationException
uses util.RedisConfig
uses model.database.Document
uses util.iterable.SkipIterable
uses model.database.MongoCollection
uses util.RedisConfig

abstract class Job extends Document implements Runnable {

  static var collection : String as readonly COLLECTION = 'jobs'
  protected static final var MAX_PROGRESS_VALUE : int = 100

  construct() {
    super(COLLECTION)
    UUId = UUID.randomUUID().toString()
    Progress = 0
    Type = IntrinsicType.Name
    save()
  }

  construct(key : String, value : Object) {
    super(COLLECTION, key, value)
  }

  override final function run() {
    try {
      executeJob()
      Progress = 100
      save()
    } catch(ce : CancellationException) {
      //Do nothing
    } catch(e : Exception) {
      handleErrorState(e)
    }
  }

  function checkCancellation() {
    if (Cancelled) throw new CancellationException()
  }

  function handleErrorState(e : Exception) {
    put('Exception', e.StackTraceAsString)
    Status = 'Failed'
    EndTime = System.currentTimeMillis()
    save()
    e.printStackTrace()
  }

  abstract function executeJob()

  final function start() : jobs.Job {
    RedisConfig.INSTANCE.enqueue('main',new Job(this.IntrinsicType.Name,new Object[]{'UUId',UUId}))
    return this
  }

  function join() {
    while(this.Progress < 100) {
      Thread.sleep(100)
    }
  }

  abstract function doReset()

  final function reset() {
    put('StatusFeed', null)
    Status = 'Active'
    Progress = 0
    doReset()
    EndTime = null
    save()
    start()
  }

  property get Type() : String {
    return get('Type') as String
  }

  property set Type(type : String) {
   put('Type', type)
  }

  property get Failed() : boolean {
    return Status == "Failed"
  }

  property get StartTime() : Long {
    return get('StartTime') as Long
  }

  property set StartTime(time : Long) {
    put('StartTime', time)
  }

  property get EndTime() : Long {
    return get('EndTime') as Long
  }

  property set EndTime(time : Long) {
    put('EndTime', time)
  }

  property get UUId() : String {
    return get('UUId') as String
  }

  property set UUId(newUUId : String) {
    put('UUId', newUUId)
  }

  property get Progress() : int {
    return get('Progress') as Integer ?: 0
  }

  property set Progress(progress : int) {
    if (progress == MAX_PROGRESS_VALUE) {
      this.Status = 'Complete'
    }
    put('Progress', progress)
    checkBounds(progress)
  }

  property get StatusFeed() : String {
    return get('StatusFeed') as String ?: ""
  }

  property set StatusFeed(feedUpdate : String) {
    put('StatusFeed', this.StatusFeed+feedUpdate+"\n")
  }

  property set FieldName(field: String) {
    put('Field', field)
  }

  property get FieldName() : String {
    return get('Field') as String
  }

  function cancel() {
    Cancelled = true
    save()
  }

  static function findByStatus(status : String, owner : String) : SkipIterable<jobs.Job> {
    if (status == 'all') {
      return getAllJobs(owner)
    } else if (status == 'failed') {
      return getFailedJobs(owner)
    } else if (status == 'cancelled') {
      return getCancelledJobs(owner)
    } else if (status == 'running') {
      return getActiveJobs(owner)
    } else if (status == 'completed') {
      return getCompleteJobs(owner)
    }
    throw "Unsupported state for jobs: ${status}"
  }

  property set Cancelled(status : boolean) {
    EndTime = System.currentTimeMillis()
    if (status) {
      put('Status', 'Cancelled')
    } else {
      put('Status', 'Reset')
    }
  }

  property get Cancelled() : boolean {
    if (Thread.currentThread().isInterrupted()) {
      this.Cancelled = true
      return true
    }
    return (Status == 'Cancelled')
  }

  property get Status() : String {
    return get('Status') as String
  }

  property set Status(status : String) {
    put('Status', status)
  }

  property get ElapsedTime() : String {
    return calculateElapsedTime(this.StartTime, this.EndTime)
  }

  private function calculateElapsedTime(start : Long, end : Long) : String {
    if (start == null) return "0 Seconds"
    var totalSeconds = (((end ?: System.currentTimeMillis()) - start) / 1000)
    var returnString = ""
    if (totalSeconds > 3600) {
      var hours = totalSeconds / 3600
      returnString += hours + " Hours "
      totalSeconds -= hours*3600
    }
    if (totalSeconds > 60) {
      var minutes = totalSeconds / 60
      returnString += minutes + " Minutes "
      totalSeconds -= minutes*60
    }
    return returnString + totalSeconds + " Seconds"
  }

  /*
  * If we are either at the start or the end of the job, log the status
   */
  private function checkBounds(progress : int) {
    if (progress == 0) {
      this.StartTime =  System.currentTimeMillis()
      this.Status = 'Active'
    } else if (progress == MAX_PROGRESS_VALUE) {
      this.Status = 'Complete'
      this.EndTime = System.currentTimeMillis()
    }
  }

  function displayState(state : String) {
    put('State', state)
  }

  static function getActiveJobs(owner : String) : SkipIterable<jobs.Job> {
    return findMany({'Status' -> 'Active', 'Owner' -> owner}, COLLECTION) as SkipIterable<jobs.Job>
  }

  static function getCompleteJobs(owner : String) : SkipIterable<jobs.Job> {
    return findMany({'Status' -> 'Complete', 'Owner' -> owner}, COLLECTION) as SkipIterable<jobs.Job>
  }

  static function getCancelledJobs(owner : String) : SkipIterable<jobs.Job> {
    return findMany({'Status' -> 'Cancelled', 'Owner' -> owner}, COLLECTION) as SkipIterable<jobs.Job>
  }

  static function getFailedJobs(owner : String) : SkipIterable<jobs.Job> {
    return findMany({'Status' -> 'Complete', 'Owner' -> owner}, COLLECTION) as SkipIterable<jobs.Job>
  }

  static function getAllJobs(owner : String) : SkipIterable<jobs.Job> {
    return instantiateMany(new MongoCollection(COLLECTION).queryNotAndIs('Status', 'Subjob', 'Owner', owner)) as SkipIterable<jobs.Job>
  }

  // This is for Salesforce uploading
  static property get CompleteRecommendJobs() : SkipIterable<jobs.Job> {
    return findMany({'Status' -> 'Complete', 'Type' -> 'jobs.RecommendJob'}, COLLECTION) as SkipIterable<jobs.Job>
  }

  static function findByIDs(IDs : List<String>) : SkipIterable<jobs.Job> {
    if (IDs == null) return null
    return instantiateMany(new MongoCollection(COLLECTION).queryOr(IDs, 'UUId')) as SkipIterable<jobs.Job>
  }

  static function findJob(UUID : String) : jobs.Job {
    return Document.find('UUId', UUID, COLLECTION) as jobs.Job
  }

  abstract function renderToString() : String

}