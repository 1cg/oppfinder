<%@ params(dataSetInfo : util.iterable.PagerIterable<model.DataSetInfo>) %>

<div>
  <h2 class="page-title">Data Sets</h2>
  <a href="/datasets/new" class="btn btn-primary pull-right">Create DataSet</a>
</div>

<div id='wrapper'>
  ${view.datasets.DataSetTableBody.renderToString(dataSetInfo)}
</div>

