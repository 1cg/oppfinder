<%@ params(dataSetNames : util.PagerIterable<java.util.Map<Object,Object>>) %>
<table class="table">
  <thead>
    <tr>
      <th>
        DataSets
      </th>
    </tr>
  </thead>
  <tbody>
  <% for (result in dataSetNames) {%>
    <tr>
      <td>
        <a href='/datasets/${result}' style="color:#476CB5">${result['name']}</a>
      </td>
    </tr>
  <% } %>
  </tbody>
</table>
${new widgets.PagerWidget().renderWidget(dataSetNames)}