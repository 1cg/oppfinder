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
    return raw(ResultTableBody.renderToString(Request.Session.attribute("code"), Results.AllResults.paginate(Params['page'])))
  }

  override function index(): Object {
    var code = Params['code']
    if (code != null && code != "") Request.Session.attribute("code", code)
    return ResultTable.renderToString(code, Results.AllResults.paginate(Params['page']))
  }

  override function _new(): Object {
    return ResultUpload.renderToString(Results.AllResults, Request.Session.attribute("code"))
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    return Result.renderToString(Request.Session.attribute("code"), Results.getResults(id))
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }
}