<div class="container">
  <div class="progress progress-striped active navbar-left" style="width:95%">
    <div class="progress-bar"
      ic-transition="none"
      ic-style-src="width:/jobs/generateprogress"
      ic-poll="300ms"
      style="width:${new controller.JobController().generateProgress()}">
    </div>
  </div>
  <div ic-src="/jobs/generatecomplete" ic-poll="300ms" ic-transition="none">
    ${new controller.JobController().generateComplete()}
  </div>
</div>


