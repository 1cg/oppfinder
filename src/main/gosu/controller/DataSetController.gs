package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.Layout
uses view.Companies
uses view.DataSetTable
uses model.DataSetEntry

class DataSetController implements IHasRequestContext, IResourceController {

  override function index() {
    Writer.append(Layout.renderToString(DataSetTable.renderToString(model.DataSetEntry.AllDataSets()))) // LATER come back to this and paginate it
  }
  override function show(id: String) {
    Writer.append(Layout.renderToString(Companies.renderToString(1, id, DataSetEntry.FindDataSet(id).paginate(Params['page']))))
  }
  override function create() {
  }
  override function _new() {
  }
  override function edit(id: String) {
  }
  override function update(id: String) {
  }
}