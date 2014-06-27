<div>
  <h1><i class="fa fa-search myColor"></i> <span>Opportunity</span> <span>Finder</span></h1>
  <p>Find new business opportunities in your existing Policy clientbase!</p>
  <hr/>
  <div>
  <form class="form-inline" role="form" ic-post-to="/jobs/startrecommend">
    <div class="form-group">
    <label>
      <strong>Select DataSet: </strong>
    </label>
    <select class="form-control" name="collections">
<div class="jumbotron">
  <h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder  </span></h1>

  <p>Welcome to OpportunityFinder, the 2014 Gosu Summer Intern Project!</p><br>

  <a class="btn btn-lg btn-primary" href="/companies/">
    <strong>Upload or generate data</strong>
  </a>

  <button ic-post-to="/jobs/action/start/test" ic-target="#feedback" class="btn btn-lg btn-primary">
    <strong>Begin Test &rarr;</strong>
  </button>



  <form method="post" action="/jobs/action/start/recommend">
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
      <button ic-post-to="/jobs/starttest" class="btn btn-default">
        Run Test Job
      </button>
    </div>
    <button type="submit" value="Recommend!" class="btn btn-lg btn-primary">Recommend!</button>
  </form>

  <!-- This URL is currently janky as hell but it works for now (copy paste it into the browser) -->

  <a class="btn" href="https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9xOCXq4ID1uHgL9H.cY5bCyugh.IQXPoeCKgVGLWwC3NvV3Zqj08_KIEEViJmJ.i7hDLkO89Q20ykTyu_&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2F%5Fauth&state=mystate">Authorize Salesforce</a>

  <a href="/companies/">Generate Or Import DataSet</a>
  </div>
</div>
${view.JobTable.renderToString("all", controller.PagerController.getPager("all", 1))}
