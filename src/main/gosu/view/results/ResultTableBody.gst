<%@ params(code : String, resultNames : util.PagerIterable<java.util.Map<Object,Object>>) %>
<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th>
        Result Id
      </th>
      <th>
        Upload to Salesforce
      </t>
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
        <a href='/results/${result['UUId']}&code=${code}' style="color:#476CB5">${result['UUId']}</a>
      </td>
      <td>
        <a class="btn" ic-post-to="/results?type=auth&id=0000&code=${code}">Test!</a>
      </td>
   </tr>
   <% }
  } %>
  </tbody>
</table>
${new widgets.PagerWidget().renderWidget(resultNames)}
