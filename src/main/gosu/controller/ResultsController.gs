package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.results.ResultTable
uses model.Results
uses view.results.Result
uses view.results.ResultUpload

class ResultsController implements  IHasRequestContext, IResourceController {

  override function index(): Object {
    var code = Params['code']
    var loggedIn = (code != null && code != "")
    if (loggedIn) {
      Request.Session.attribute("code", code)
    }
    return ResultTable.renderToString(loggedIn, Results.AllResults.paginate(Params['page']))
  }

  override function _new(): Object {
    return ResultUpload.renderToString(Results.AllResults, Request.Session.attribute("code"))
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    var code = Request.Session.attribute("code") // UGH
    var loggedIn = (code != null && code != "")
    return Result.renderToString(id, Results.getResults(id), loggedIn)
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }
}