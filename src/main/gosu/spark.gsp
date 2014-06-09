uses com.oreilly.servlet.MultipartRequest
extends sparkgs.SparkFile

Layout = view.Layout

/* Getters for job information */
get('/', \-> view.Root.renderToString() )
get('/jobs/running', \-> view.Running.renderToString())
get('/jobs/complete', \-> view.Complete.renderToString())
get('/jobs/cancelled', \-> view.Cancelled.renderToString())
get('/jobs/:id/percent_done', \-> jobs.Job.getUUIDProgress(Params['id']))
get('/jobs/:id/info', \-> jobs.Job.renderToString(Params['id']))

/* Start Jobs */
post('/jobs/test', \-> controller.JobController.startTestJob())
post('/jobs/generate', \-> controller.JobController.startGenerateJob())
post('/jobs/:id/cancel', \-> jobs.Job.cancel(Params['id']))
post('/jobs/:id/reset', \-> jobs.Job.reset(Params['id']))
post(new Route("/upload") {

  @Override
  public String h(Request request, Response response) throws Exception {
  final File upload = new File("upload");
  if (!upload.exists() && !upload.mkdirs()) {
    throw new RuntimeException("Failed to create directory " + upload.getAbsolutePath());
  }
  // this dumps all files contained in the multipart request to target directory.
  final MultipartRequest req = new MultipartRequest(request.raw(), upload.getAbsolutePath());
  halt(200);
  return null;
}
})

get('/companies', \-> view.Companies.renderToString() )
get("*", \-> view.BadPath.renderToString())
