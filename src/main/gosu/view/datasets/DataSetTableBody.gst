<%@ params(dataSetNames : util.iterable.PagerIterable<java.util.Map<Object,Object>>) %>
<table class="table">
  <thead>
    <tr>
      <th>
        DataSet
      </th>
      <th>
        Size
      </th>
      <th>
        Created
      </th>
    </tr>
  </thead>
  <tbody>
  <% for (result in dataSetNames) {%>
    <tr>
      <td>
        <a href='/datasets/${java.net.URLEncoder.encode(result['name'] as String,"UTF-8")}'>${result['name']}</a>
      </td>
      <td>
        ${result['size'] ?: ""}
      </td>
      <td>
        ${result['created'] ?: ""}
      </td>
    </tr>
  <% } %>
  </tbody>
</table>
${new widgets.PagerWidget().renderWidget(dataSetNames)}