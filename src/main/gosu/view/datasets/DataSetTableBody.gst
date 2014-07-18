<%@ params(dataSetInfo : util.iterable.PagerIterable<model.DataSetInfo>) %>
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
  <% for (result in dataSetInfo) {%>
    <tr>
      <td>
        <a href='/datasets/${java.net.URLEncoder.encode(result.Name as String,"UTF-8")}'>${result.Name}</a>
      </td>
      <td>
        ${result.get('Size') ?: ""}
      </td>
      <td>
        ${result.Created ?: ""}
      </td>
    </tr>
  <% } %>
  </tbody>
</table>
${new widgets.PagerWidget().renderWidget(dataSetInfo)}