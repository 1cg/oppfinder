uses net.greghaines.jesque.worker.*
uses java.lang.Thread
uses java.lang.System
uses util.RedisConfigUtil

var workers = System.Env["JESQUE_WORKERS"]?.toInt()

for (i in 0..|((workers == 0) ? 4 : workers)) {
  var worker = new WorkerImpl(RedisConfigUtil.INSTANCE.CONFIG, {'main'}, new ReflectiveJobFactory())
  new Thread(worker).start()
  print("Worker Thread Started!")
}

