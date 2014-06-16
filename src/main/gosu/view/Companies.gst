<%@ params(page : long)%>
<% var pager = new model.Pager<java.util.Map<Object,Object>>(model.DataSetEntry.All, 10) %>
<h2>Either randomly generate or upload your own data.</h2>
<p>The table of data is displayed below.</p><br>


<button ic-post-to="/jobs/action/start/generate" ic-target="#generateFeedback" class="btn btn-lg btn-primary">
  Generate Data
</button>
<span id="generateFeedback"></span>
<h3>
  OR
</h3>
<form method="post" enctype="multipart/form-data" action="/jobs/action/start/upload">
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
    <% for (entry in pager.getPage(page)) { %>
      <tr>
        <% for (type in model.Company.CompanyDataTypes) { %>
          <td> ${entry[type]} </td>
        <% } %>
      </tr>
    <% } %>
  </tbody>
</table>
<ul class="pagination navbar-right">
  <li class=${pager.checkStatus(page -1)}>
    <a href="/companies/${java.lang.Math.max(pager.Current -1, 1)}">&laquo;</a>
  </li>
  <% for (i in -2..2) { %>
  <li class=${pager.checkStatus(java.lang.Math.max(page + i, i + 3))}>
    <a href="/companies/${java.lang.Math.max(pager.Current +i, i + 3)}">${java.lang.Math.max(pager.Current + i,  i + 3)}</a>
  </li>
  <% } %>
  <li class=${pager.checkStatus(page +1)}>
    <a href="/companies/${pager.Current +1}">&raquo;</a>
  </li>
</ul>

