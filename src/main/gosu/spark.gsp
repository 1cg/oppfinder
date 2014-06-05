uses view.Companies

extends sparkgs.SparkFile

Layout = view.Layout

get('/', \-> view.Root.renderToString() )

get('/companies', \-> view.Companies.renderToString() )
get('/jobs/:id/percent_done', \-> view.Root.renderToString() )

post('/jobs/test', \-> controller.JobController.startTestJob() )
post('/generate', \-> controller.JobController.startGenerateJob() )
