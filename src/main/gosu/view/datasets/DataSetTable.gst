<%@ params(dataSetNames : util.PagerIterable<java.util.Map<Object,Object>>) %>
<h2>Either randomly generate or upload your own data.</h2><br>
<a href="/datasets/new" class="btn btn-default">
          Generate/Import Data
</a>
<div id='wrapper'>
  ${view.datasets.DataSetTableBody.renderToString(dataSetNames)}
</div>

