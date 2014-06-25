<div class="jumbotron">
  <h1><i class="fa fa-search myColor"></i> <span>Opportunity</span><span>Finder</span></h1>
  <p>Welcome to OpportunityFinder, the 2014 Gosu Summer Intern Project!</p><br>
  <button ic-post-to="/jobs/action/start/test" class="btn btn-lg btn-primary">
    <strong>Begin Test &rarr;</strong>
  </button>
  <form class="form-group" ic-post-to="/jobs/action/start/recommend">
    <select data-live-search="true" class="selectpicker" name="collections">
      <optgroup label="Most Recent">
      <% for(collection in model.DataSetEntry.AllDataSets()){ %>
        <option value=${collection}>${collection}</option>
      <% } %>
      </optgroup>
      <optgroup label="Least Recent">
      </optgroup>
    </select>
    <input class="btn btn-lg btn-primary" type="submit" value="Recommend!">
  </form>
</div>
${controller.TableController.getRunningTable(1)}
