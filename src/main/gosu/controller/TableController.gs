package controller

uses view.JobTableBody
uses sparkgs.IResourceController
uses sparkgs.util.IHasRequestContext

class TableController implements IResourceController, IHasRequestContext {

  override function index() {
    var status = Params['status'] ?: "all"
    var page = Params['page'] == null ? 1 : Params['page'].toLong()
    Writer.append(JobTableBody.renderToString(status, PagerController.getPager(status,page)))
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