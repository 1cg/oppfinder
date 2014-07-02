package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.Layout

class ResultsController implements  IHasRequestContext, IResourceController {
  function _auth() {
    // This writes out the INDEX with the code argument
//    Writer.append(Layout.renderToString(SalesforceUpload.renderToString(Params['code'])))
  }
    // This writes out the index without the code argument

  override function index(): Object {
    return null
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