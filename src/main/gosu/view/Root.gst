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
      <optgroup label="Least Recent">
      </optgroup>
    </select>
    <button type="submit" value="Recommend!" class="btn btn-lg btn-primary">Recommend!</button>
  </form>

  <!-- This URL is currently janky as hell but it works for now (copy paste it into the browser) -->
  <form action="https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9xOCXq4ID1uHgL9H.cY5bCyugh.IQXPoeCKgVGLWwC3NvV3Zqj08_KIEEViJmJ.i7hDLkO89Q20ykTyu_&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2F%5Fauth&state=mystate">
    <input type="submit" value="Authorize Salesforce">
  </form>

  <span id="feedback"></span>
</div>
${controller.TableController.getRunningTable(1)}
