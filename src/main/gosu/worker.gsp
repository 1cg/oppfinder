uses net.greghaines.jesque.*
uses net.greghaines.jesque.worker.*
uses java.lang.Thread
uses model.JobWorkerTracker
uses model.WorkerStartListener

var config = new ConfigBuilder().build()

var worker = new WorkerImpl(config, {'main'}, new ReflectiveJobFactory())
worker.getWorkerEventEmitter().addListener(new JobWorkerTracker())

new Thread(worker).start()

print("Worker Thread Started!")

