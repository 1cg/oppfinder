package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController

class ResultsController implements  IHasRequestContext, IResourceController {

  override function index(): Object {
    return ""
  }

  override function _new(): Object {
    return ""
  }

  override function create(): Object {
    return ""
  }

  override function show(id: String): Object {
    return ""
  }

  override function edit(id: String): Object {
    return ""
  }

  override function update(id: String): Object {
    return ""
  }
}