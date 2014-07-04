<%@ params(loggedIn : boolean, resultNames : util.PagerIterable<java.util.Map<Object,Object>>) %>
<div>
  <h2 class="page-title">Results</h2>
  <a href="/results/new" class="btn btn-primary pull-right">New Analysis</a>
</div>

<div id='wrapper'>
  <% if (!loggedIn) { %>
    <h2><i class="fa fa-warning"></i> Please <a href="https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${java.lang.System.Env['SF_CLIENT_ID']}&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2Fresults&state=mystate">
        log in to Salesforce</a> to upload results
    </h2>
  <% } %>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>
          Result Id
        </th>
      <% if (loggedIn) { %>
        <th>
          Upload to Salesforce
        </t>
      <% } %>
      </tr>
    </thead>
    <tbody>
      <%
       if (resultNames.Current == 1 && resultNames.Count == 0) { %>
        <br>
        <div class="alert alert-info alert-dismissable">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
          <strong>Attention: </strong> There are currently no recommendation results in the database
        </div>
      <% } else {
    for(result in resultNames)  {%>
      <tr>
        <td>
          <a href='/results/${result['UUId']}'>${result['UUId']}</a>
        </td>
      <% if (loggedIn) { %>
        <td>
          <a ic-post-to="/jobs?type=%auth&id=${result['UUId']}">Upload</a>
        </td>
      <% } %>
     </tr>
     <% }
  } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(resultNames)}
</div>
