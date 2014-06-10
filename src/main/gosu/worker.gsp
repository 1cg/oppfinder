uses net.greghaines.jesque.*
uses net.greghaines.jesque.worker.*
uses java.lang.Thread
uses java.lang.System

var config = new ConfigBuilder().build()
var workers = System.getenv("JESQUE_WORKERS")?.toInt()

for (i in 0..|((workers == 0) ? 4 : workers)) {
  var worker = new WorkerImpl(config, {'main'}, new ReflectiveJobFactory())
  new Thread(worker).start()
  print("Worker Thread Started!")
}

