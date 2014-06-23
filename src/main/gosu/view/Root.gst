<div class="jumbotron">
  <h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder  </span></h1>

  <p>Welcome to OpportunityFinder, the 2014 Gosu Summer Intern Project!</p><br>

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
</div>
${controller.TableController.getRunningTable(1)}
