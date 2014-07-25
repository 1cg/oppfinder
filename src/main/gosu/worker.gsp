uses net.greghaines.jesque.worker.*
uses java.lang.Thread
uses java.lang.System
uses util.RedisConfig

var workers = System.Env["JESQUE_WORKERS"]?.toInt()

for (i in 0..|((workers == 0) ? 4 : workers)) {
  var worker = new WorkerImpl(RedisConfig.INSTANCE.CONFIG, {'main'}, new ReflectiveJobFactory())
  new Thread(worker).start()
  print("Worker Thread Started!")
}

