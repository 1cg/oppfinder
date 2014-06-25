<div class="container">
  <div class="progress progress-striped active navbar-left" style="width:95%">
    <div class="progress-bar"
      ic-transition="none"
      ic-style-src="width:/jobs/generate/percent_done"
      ic-poll="300ms"
      style="width:${controller.JobController.LocalGenerateProgress}">
    </div>
  </div>
  <div ic-src="/jobs/generate/complete" ic-poll="300ms" ic-transition="none">
    ${controller.JobController.LocalGenerateComplete}
  </div>
</div>


