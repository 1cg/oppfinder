extends sparkgs.SparkFile

Layout = view.Layout

get('/', \-> view.Root.renderToString() )

post('/jobs/test', \-> controller.JobController.startTestJob() )

get('/companies', \-> view.Companies.renderToString() )

post('/generate', \-> controller.JobController.startGenerateJob() )

get('/jobs/:id/percent_done', \-> view.Root.renderToString() )

