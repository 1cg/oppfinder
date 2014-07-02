package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.companies.Companies
uses view.datasets.DataSetTable
uses model.DataSet
uses view.datasets.GenerateUploadPage

class DataSetController implements IHasRequestContext, IResourceController {

  override function index() : String {
    return DataSetTable.renderToString(model.DataSet.allDataSets.paginate(Params['page'] ?: 1))
  }
  override function show(id: String) : String {
    return Companies.renderToString(1, id, DataSet.find(id).paginate(Params['page']))
  }
  override function create() {
  }
  override function _new() : String {
    return GenerateUploadPage.renderToString()
  }
  override function edit(id: String) {
  }
  override function update(id: String) {
  }
}