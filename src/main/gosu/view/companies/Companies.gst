<%@ params(page : long, id : String, pager: util.PagerIterable<java.util.Map>)%>
<h2>DataSet: ${id}</h2><br>
<a href='/datasets' style="color:#476CB5"><strong>Back to DataSets</strong></a>
<div id='wrapper'>
  ${CompanyTable.renderToString(pager)}
</div>

