<%@ params(collections : util.iterable.SkipIterable<java.util.Map<Object,Object>>) %>
<div class='jumbotron'>
  <h2>Select a dataset to analyze</h2>
  <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend">
    <div class="form-group">
    <label>
      <strong>Select DataSet: </strong>
    </label>
    <select class="form-control" name="collections">
      <optgroup label="Most Recent">
        <% for(collection in collections){ %>
          <option value=${java.net.URLEncoder.encode(collection['name'] as String,'UTF-8')}>${collection['name']} (${collection['size']})</option>
        <% } %>
      </optgroup>
    </select>
    </div>
    <div class="form-group">
      <input class="btn btn-primary" type="submit" value="Start Analysis">
    </div>
   </form>
</div>
