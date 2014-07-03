<div>
  <h2 class="page-title">New Data Set</h2>
</div>

<div class="row">
  <div class="col-md-6">
      <h4>Generate Data Set</h4>
      <div class="well well-sm">
      <form ic-post-to="/jobs?type=generate" role="form">
        <label for="dataSetName">New Data Set Name</label>
        <input type="text" class="form-control" name="dataSetName" placeholder="Leave blank for random name">
        <br>
        <label for="generateStrategy">Generation Method</label>
        <div class="radio" name="options">
        <label><input type="radio" name="generateStrategy" value="random">Random<br></label>
        <label><input type="radio" name="generateStrategy" value="Reach">Test Reaches<br></label>
        </div>
        <button type="submit" value="Submit" class="btn btn-primary">Generate DataSet</button>
      </form>
      </div>
  </div>

  <div class="col-md-6">
    <h4>
      Or Upload JSON Data Set
    </h4>
    <div class="well well-sm">
      <form method="post" enctype="multipart/form-data" action="/jobs?type=upload">
        <div class="fileinput fileinput-new" data-provides="fileinput">
        <span class="btn btn-primary btn-file"><span class="fileinput-new">Select file</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span>
        <span class="fileinput-filename"></span>
        <a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a>
        <input type="submit" value="Upload DataSet" class="btn btn-primary"/>
        </div>
      </form>
    </div>
  </div>
</div>