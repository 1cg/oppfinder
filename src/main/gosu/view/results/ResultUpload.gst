<%@ params(results : util.SkipIterable<java.util.Map<Object,Object>>, code : String) %>
<div class='jumbotron'>
  <h2>Select a dataset to upload to Salesforce</h2>
  <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend">
    <div class="form-group">
    <label>
      <strong>Select DataSet: </strong>
    </label>
    <select class="form-control" name="id">
      <optgroup label="Most Recent">
        <% for(result in results){ %>
          <option value=${result['UUId']}>${result['UUId']}</option>
        <% } %>
      </optgroup>
    </select>
    </div>
    <div class="form-group">
      <input class="btn btn-primary" type="submit" value="Start Upload to Salesforce">
    </div>
   </form>
</div>
