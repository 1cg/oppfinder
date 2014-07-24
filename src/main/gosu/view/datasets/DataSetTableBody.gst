<%@ params(dataSetInfo : util.iterable.PagerIterable<model.DataSetInfo>) %>
<div ic-src='/datasets/table?page=${dataSetInfo.Current}' ic-deps='/datasets'>
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
        <th>
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
    <% for (result in dataSetInfo) {%>
      <tr>
        <td>
          <a href='/datasets/${java.net.URLEncoder.encode(result.Name,"UTF-8")}'>${result.Name}</a>
        </td>
        <td>
          ${result.get('Size') ?: ""}
        </td>
        <td>
          ${result.Created ?: ""}
        </td>
        <td>
          <button ic-confirm="Are you sure you want to delete this data set?" ic-post-to="/datasets/delete?id=${java.net.URLEncoder.encode(result.Name,"UTF-8")}" class="btn btn-danger btn-sm" role="button">
            <span class="glyphicon glyphicon-trash">
            </span>
          </button>
        </td>
      </tr>
    <% } %>
    </tbody>
  </table>
  ${new widgets.PagerWidget().renderWidget(dataSetInfo)}
</div>