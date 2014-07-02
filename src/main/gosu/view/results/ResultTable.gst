<%@ params(code : String, resultNames : util.PagerIterable<java.util.Map<Object,Object>>) %>
<h2>Either randomly generate or upload your own data.</h2><br>
<a href="/datasets/new" class="btn btn-default">
          Generate/Import Data
</a>
<div id='wrapper'>
  <% if (code == null || code == "") { %>
    <h2>Please <a href="https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9xOCXq4ID1uFvTCKN7SyVYdNd2wGzeDj0D.bK751bqhCLLzaTqEfj8GVVPI1c3AY83tn8fRdVl09T7Wqg&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2Fresults&state=mystate">
        log in to Salesforce</a>
    </h2>
  <% } else { %>
    ${view.results.ResultTableBody.renderToString(code, resultNames)}
  <% } %>
</div>
