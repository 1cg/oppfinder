package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.results.ResultTable
uses model.Results

class ResultsController implements  IHasRequestContext, IResourceController {

  function _auth() : Object {
    // This writes out the INDEX with the code argument
    return ResultTable.renderToString(Params['code'], Results.AllResults.paginate(Params['page']))
  }
    // This writes out the index without the code argument

  override function index(): Object {
    return ResultTable.renderToString(Params['code'], Results.AllResults.paginate(Params['page']))
  }

  override function _new(): Object {
    return null
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    return null
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }
}