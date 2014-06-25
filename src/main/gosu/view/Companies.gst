<%@ params(page : long)%>
<h2>Either randomly generate or upload your own data.</h2><br>
<div class="jumbotron">
  <h3> Generate New Data Set </h3>
  <form ic-post-to="/jobs/action/start/generate" role="form">
    <label for="dataSetName">New Data Set Name</label>
    <input type="text" class="form-control" name="dataSetName" placeholder="Leave blank for random UUID">
    <br>
    <label for="generateStrategy">Generation Method</label>
    <div class="radio" name="options">
    <label><input type="radio" name="generateStrategy" value="random">Random<br></label>
    <label><input type="radio" name="generateStrategy" value="Reach">Test Reaches<br></label>
    </div>
    <button type="submit" value="Submit" class="btn btn-lg btn-primary">Submit</button>
  </form>
  <h3>
    Upload JSON Data Set
  </h3>
  <form method="post" enctype="multipart/form-data" action="/jobs/action/start/upload">
    <div class="fileinput fileinput-new" data-provides="fileinput">
    <span class="btn btn-lg btn-primary btn-file"><span class="fileinput-new">Select file</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span>
    <span class="fileinput-filename"></span>
    <a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a>

    <input type="submit" value="Submit" class="btn btn-lg btn-primary"/>
    </div>
  </form>
  <div>
    ${view.ProgressView.renderToString()}
  </div>
</div>
<div ic-src="/companies/table/${page}" ic-deps="/jobs/action">
  ${CompanyTable.renderToString(controller.PagerController.getCompanyPager(page))}
</div>

