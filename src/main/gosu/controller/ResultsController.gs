package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.results.ResultTable
uses model.ResultInfo
uses view.results.Result
uses view.results.ResultUpload
uses view.results.NewAnalysis

class ResultsController implements  IHasRequestContext, IResourceController {

  override function index(): Object {
    var code = Params['code']
    var hasAttribute = Request.Session.attribute("code") != null
    var loggedIn = ((code != null && code != "") || hasAttribute)
    if (loggedIn && !hasAttribute) {
      Request.Session.attribute("code", code)
    }
    return ResultTable.renderToString(loggedIn, ResultInfo.All.paginate(Params['page']))
  }

  function push() : Object {
    return ResultUpload.renderToString(ResultInfo #AllResultsNames)
  }

  override function _new(): Object {
    return NewAnalysis.renderToString()
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    var code = Request.Session.attribute("code") as String
    var loggedIn = (code != null && code != "")
    return Result.renderToString(id, ResultInfo.findResults(id), loggedIn, ResultInfo.getSource(id))
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }
}