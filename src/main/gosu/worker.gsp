uses net.greghaines.jesque.*
uses net.greghaines.jesque.worker.*
uses java.lang.Thread
uses java.lang.System

var builder = new ConfigBuilder()
var host = System.Env['REDIS_HOST']
if (host != null) {
  builder.withHost(host)
}
var config = builder.build()
var workers = System.Env["JESQUE_WORKERS"]?.toInt()

for (i in 0..|((workers == 0) ? 4 : workers)) {
  var worker = new WorkerImpl(config, {'main'}, new ReflectiveJobFactory())
  new Thread(worker).start()
  print("Worker Thread Started!")
}

