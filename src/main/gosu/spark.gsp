extends sparkgs.SparkFile

get('/', \-> view.Root.renderToString() )

post('/test', \-> controller.JobController.startTestJob() )

