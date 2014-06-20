<%@ params(page : long)%>
<h2>Either randomly generate or upload your own data.</h2>
<p>The table of data is displayed below.</p><br>


<button ic-post-to="/jobs/action/start/generate" ic-target="#generateFeedback" ic-transition="none" class="btn btn-lg btn-primary">
  Generate Random
</button>
<button ic-post-to="/jobs/action/start/generateTest/Reach" ic-target="#generateFeedback" ic-transition="none" class="btn btn-lg btn-primary">
  Generate Test Reaches
</button>
<button ic-post-to="/jobs/action/start/generateTest/Region" ic-target="#generateFeedback" ic-transition="none" class="btn btn-lg btn-primary">
  Generate Test Regions
</button>
<button ic-post-to="/jobs/action/start/generateTest/Revenue" ic-target="#generateFeedback" ic-transition="none" class="btn btn-lg btn-primary">
  Generate Test Revenues
</button>
<button ic-post-to="/jobs/action/start/generateTest/Size" ic-target="#generateFeedback" ic-transition="none" class="btn btn-lg btn-primary">
  Generate Test Sizes
</button>
<h3>
  OR
</h3>
<form method="post" enctype="multipart/form-data" action="/jobs/action/start/upload">
  <div class="fileinput fileinput-new" data-provides="fileinput">
  <span class="btn btn-lg btn-primary btn-file"><span class="fileinput-new">Select file</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span>
  <span class="fileinput-filename"></span>
  <a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a>

  <input type="submit" value="Submit" class="btn btn-lg btn-primary"/>
  </div>
</form>
<div ic-src="/companies/table/${page}" ic-deps="/jobs/action">
  ${CompanyTable.renderToString(controller.PagerController.getCompanyPager(page))}
</div>

