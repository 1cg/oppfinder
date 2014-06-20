<h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder  </span></h1>

<p>Welcome to OpportunityFinder, the 2014 Gosu Summer If Intern Project!</p>

<p>Would you like to begin a new analysis?</p>

<a class="btn btn-lg btn-primary" href="/companies/">
  <strong>Upload or generate data</strong>
</a>

<button ic-post-to="/jobs/action/start/test" ic-target="#feedback" class="btn btn-lg btn-primary">
  <strong>Begin Test &rarr;</strong>
</button>

<button ic-post-to="/jobs/action/start/recommend" ic-target="#feedback" class="btn btn-lg btn-primary">
  <strong>Begin Recommendation Analysis &rarr;</strong>
</button>

<span id="feedback"></span>
${controller.TableController.getRunningTable(1)}
