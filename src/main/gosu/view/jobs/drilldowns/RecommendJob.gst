<%@ params(job : jobs.RecommendJob) %>
<h3 class="sub-section-header">Sub Jobs: </h3>
<div>
  ${new controller.JobController().subJobTable(job?.UUId)}
</div>