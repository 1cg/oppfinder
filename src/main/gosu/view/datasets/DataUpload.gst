DataUpload<%@ extends input_helper.InputGenerator %>
<div>
  <h2 class="page-title">New Data Set</h2>
</div>

<div class="row">
  <div class="col-md-6">
      <h4>Generate Data Set</h4>
      <div class="well well-sm">
        <form ic-post-to="/jobs?type=generate" role="form">
          ${textInput(jobs.DataUploadJob #DataSetCollection, 'New Data Set Name', {'placeholder' -> 'Leave blank for a random name','class' -> 'form-control'})}
          <br>
          ${radioInput(jobs.DataUploadJob #JobType, 'Generation Method', {'class' -> 'radio'})}
          ${submitInput('Generate Data Set', {'class' -> 'btn btn-primary'})}
        </form>
      </div>
  </div>

  <div class="col-md-6">
    <h4>
      Or Upload JSON Data Set
    </h4>
    <div class="well well-sm">
      <form method="post" enctype="multipart/form-data" action="/jobs?type=generate">
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