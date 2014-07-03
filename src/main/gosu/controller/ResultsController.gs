package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.results.ResultTable
uses model.Results
uses view.results.Result
uses view.results.ResultTableBody
uses view.results.ResultUpload

class ResultsController implements  IHasRequestContext, IResourceController {

  function table() : Object {
    return raw(ResultTableBody.renderToString(Params['code'], Results.AllResults.paginate(Params['page'])))
  }

  override function index(): Object {
    if (Params['code'] == null || Params['code'] == "") { redirect('https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9xOCXq4ID1uFvTCKN7SyVYdNd2wGzeDj0D.bK751bqhCLLzaTqEfj8GVVPI1c3AY83tn8fRdVl09T7Wqg&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2Fresults&state=mystate',307) }
    return ResultTable.renderToString(Params['code'], Results.AllResults.paginate(Params['page']))
  }

  override function _new(): Object {
    return ResultUpload.renderToString(Results.AllResults, Params['code'])
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    return Result.renderToString(Params['code'], Results.getResults(id))
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }
}