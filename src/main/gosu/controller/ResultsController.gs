package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController

class ResultsController implements  IHasRequestContext, IResourceController {

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