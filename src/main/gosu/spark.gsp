extends sparkgs.SparkFile

get('/', \-> view.Root.renderToString() )

post('/jobs/test', \-> controller.JobController.startTestJob() )


get('/jobs/:id/percent_done', \-> view.Root.renderToString() )
