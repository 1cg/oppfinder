<h2>Either randomly generate or upload your own data.</h2>
<p>The table of data is displayed below.</p><br>


<button ic-post-to="/jobs/generate" ic-target="#generateFeedback" class="btn btn-lg btn-primary">
  Generate Data
</button>
<span id="generateFeedback"></span>
<h3>
  OR
</h3>
<form method="post" enctype="multipart/form-data" action="/jobs/upload">
  <div class="fileinput fileinput-new" data-provides="fileinput">
  <span class="btn btn-lg btn-primary btn-file"><span class="fileinput-new">Select file</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span>
  <span class="fileinput-filename"></span>
  <a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a>

  <input type="submit" value="Submit" class="btn btn-lg btn-primary"/>
  </div>
</form>

<table class="table">
  <thead>
    <tr>
      <% for (type in model.Company.CompanyDataTypes) { %>
        <th> ${type} </th>
      <% } %>
    </tr>
  </thead>
  <tbody>
    <% for (entry in model.DataSetEntry.All) { %>
      <tr>
        <% for (type in model.Company.CompanyDataTypes) { %>
          <td> ${entry[type]} </td>
        <% } %>
      </tr>
    <% } %>
  </tbody>
</table>

