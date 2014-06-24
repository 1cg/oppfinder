<%@ params(page : long)%>
<h2>Either randomly generate or upload your own data.</h2><br>
<div class="jumbotron">

  <form action="/jobs/action/start/generate" method="post">
    Data Set Name: <input type="text" name="dataSetName"><br>
    <input type="radio" name="generateStrategy" value="random">Random<br>
    <input type="radio" name="generateStrategy" value="reachTest">Test Reaches<br>
    <input type="submit" value="Submit">
  </form>

  </form>
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
  <div>
    ${view.ProgressView.renderToString()}
  </div>
</div>

<div ic-src="/companies/table/${page}" ic-deps="/jobs/action">
  ${CompanyTable.renderToString(controller.PagerController.getCompanyPager(page, "POOP"))}
</div>

