package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.companies.Companies
uses view.datasets.DataSetTable
uses model.DataSet
uses view.datasets.GenerateUploadPage

class DataSetController implements IHasRequestContext, IResourceController {

  override function index() : Object {
    return DataSetTable.renderToString(model.DataSet.allDataSets.paginate(Params['page'] ?: 1))
  }
  override function show(id: String)  : Object {
    return Companies.renderToString(id, DataSet.find(id).paginate(Params['page']))
  }

  override function create()  : Object {
    return null
  }

  override function _new()  : Object {
    return GenerateUploadPage.renderToString()
  }

  override function edit(id: String) : Object {
    return null
  }

  override function update(id: String) : Object {
    return null
  }
}