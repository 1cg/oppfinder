<div id="wrapper">
  <h1><i class="fa fa-search myColor"></i> <span>Opportunity</span> <span>Finder</span></h1>
  <p>Find new business opportunities in your existing Policy clientbase!</p>
  <hr/>
  <div>
    <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend" ic-target="#wrapper">
      <div class="form-group">
      <label>
        <strong>Select DataSet: </strong>
      </label>
      <select class="form-control" name="collections">
        <optgroup label="Most Recent">
        <% for(collection in model.DataSet.allDataSets){ %>
          <option value=${collection['name']}>${collection['name']}</option>
        <% } %>
        </optgroup>
      </select>
      </div>
      <div class="form-group">
        <input class="btn btn-primary" type="submit" value="Start Opportunity Analysis">
      </div>
      <div class="form-group pull-right">
        <button ic-post-to="/jobs?type=test" class="btn btn-default" ic-target="#wrapper">
          Run Test Job
        </button>
      </div>
    </form>
  </div>
  ${view.jobs.JobTable.renderToString("all", new util.PagerIterable<jobs.Job>(jobs.Job.AllJobs, 1))}
</div>
