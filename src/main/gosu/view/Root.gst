<div>
  <h1><i class="fa fa-search myColor"></i> <span>Opportunity</span> <span>Finder</span></h1>
  <p>Find new business opportunities in your existing Policy clientbase!</p>
  <hr/>
  <div>
  <form class="form-inline" role="form" ic-post-to="/jobs/action/start/recommend">
    <div class="form-group">
    <label>
      <strong>Select DataSet: </strong>
    </label>
    <select class="form-control" name="collections">
      <optgroup label="Most Recent">
      <% for(collection in model.DataSetEntry.AllDataSets()){ %>
        <option value=${collection}>${collection}</option>
      <% } %>
      </optgroup>
    </select>
    </div>
    <div class="form-group">
      <input class="btn btn-primary" type="submit" value="Start Opportunity Analysis">
    </div>
    <div class="form-group pull-right">
      <button ic-post-to="/jobs/action/start/test" class="btn btn-default">
        Run Test Job
      </button>
    </div>
  </form>
  <a href="/companies/">Generate Or Import DataSet</a>
  </div>
</div>
<% new controller.JobController().index() %>
