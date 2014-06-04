uses net.greghaines.jesque.*
uses net.greghaines.jesque.worker.*
uses java.lang.Thread

var config = new ConfigBuilder().build()

var worker = new WorkerImpl(config, {'main'},
    new MapBasedJobFactory(
        {"TestJob" -> jobs.TestJob as java.lang.Class}
    )
)

new Thread(worker).start()

print("Worker Thread Started!")