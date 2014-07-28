package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.results.ResultTable
uses model.ResultInfo
uses view.results.Result
uses view.results.ResultUpload
uses view.results.Analysis
uses view.results.AnalysisSetup
uses model.DataSetInfo

class ResultsController implements  IHasRequestContext, IResourceController {

  override function index(): Object {
    var code = Params['code']
    var hasAttribute = Request.Session.attribute("code") != null
    var loggedIn = ((code != null && code != "") || hasAttribute)
    if (loggedIn && !hasAttribute) {
      Request.Session.attribute("code", code)
    }
    return ResultTable.renderToString(loggedIn, ResultInfo.getAll(Session['username'] as String).paginate(Params['page']))
  }

  function push() : Object {
    return ResultUpload.renderToString(ResultInfo.getAll(Session['username'] as String).map(\o->o.UUId))
  }

  override function _new(): Object {
    return Analysis.renderToString(DataSetInfo.findDS(Params['collection']), Session['username'] as String)
  }

  override function create(): Object {
    return raw(AnalysisSetup.renderToString(DataSetInfo.findDS(Params['collection'])))
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