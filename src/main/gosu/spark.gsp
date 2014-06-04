extends sparkgs.SparkFile

Layout = view.Layout

get('/', \-> view.Root.renderToString() )

post('/jobs/test', \-> controller.JobController.startTestJob() )


get('/jobs/:id/percent_done', \-> view.Root.renderToString() )
