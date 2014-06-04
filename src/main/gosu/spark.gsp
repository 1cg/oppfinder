extends sparkgs.SparkFile

Layout = view.Layout

get('/', \-> view.Root.renderToString() )

post('/test', \-> controller.JobController.startTestJob() )

