package model

uses net.greghaines.jesque.worker.*
uses redis.clients.jedis.JedisPool
uses redis.clients.jedis.JedisPoolConfig
uses java.lang.Exception
uses net.greghaines.jesque.Job
uses redis.clients.jedis.JedisMonitor

class JobWorkerTracker implements WorkerListener {
  static var pool = new JedisPool(new JedisPoolConfig(), "localhost")

  construct() {
  }

  // Where can we make Worker say that "HEY I'm working on this job!" ?
  // Puts Job's UUID -> Worker ID
  static function Put(jobUUId : String, workerID : String) {
    var jedis = pool.getResource()
    jedis.hset("jobWorkerHash", jobUUId, workerID)
  }

  // Returns ID of Worker associated with the Job
  static function Get(jobUUId : String) : String {
    var jedis = pool.getResource()
    return jedis.hget("jobWorkerHash", jobUUId)
  }

  // Removes the key field. Use this for when the job is done.
  static function Delete(jobUUId : String) {
    var jedis = pool.getResource()
    jedis.hdel("jobWorkerHash", {jobUUId})
  }

  // All workers are kept track in the WorkerSet, whether they are working a job or not
  static function AddWorker(workerID : String) {
    var jedis = pool.getResource()
    if (jedis.scard("WorkerSet") < 1) {
      jedis.monitor(new JedisMonitor() {
        override function onCommand(command : String) {
    //      if (command == "")
        }
      })
    }
    jedis.sadd("WorkerSet", {workerID})
  }
  override function onEvent(event : WorkerEvent, worker : Worker, queue : String, job : Job, runner : Object, result : Object, ex : Exception) {

  }
}