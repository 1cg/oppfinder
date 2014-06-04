extends sparkgs.SparkFile

Layout = view.Layout

get('/', \-> view.Root.renderToString() )

post('/test', \-> controller.JobController.startTestJob() )

get('/companies', \-> view.Companies.renderToString() )

post('/generate', \-> controller.JobController.startGenerateJob() )
