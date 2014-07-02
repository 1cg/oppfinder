package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.Layout

class ResultsController implements  IHasRequestContext, IResourceController {
  function _auth() {
    // This writes out the INDEX with the code argument
//    Writer.append(Layout.renderToString(SalesforceUpload.renderToString(Params['code'])))
  }
  override function index() {
    // This writes out the index without the code argument
  }

  override function _new() {
  }

  override function create() {
  }

  override function show(id: String) {
  }

  override function edit(id: String) {
  }

  override function update(id: String) {
  }
}