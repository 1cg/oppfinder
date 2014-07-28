package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.datasets.Drilldown
uses view.datasets.DataSetTable
//uses view.datasets.GenerateUploadPage
uses java.net.URLDecoder
uses model.DataSetInfo
uses view.datasets.DataSetTableBody
uses view.datasets.DataUpload

class DataSetController implements IHasRequestContext, IResourceController {

  override function index() : Object {
    return DataSetTable.renderToString(DataSetInfo.getAll(Session['username'] as String).paginate(Params['page'] ?: "1"))
  }

  override function show(id: String)  : Object {
    var did = URLDecoder.decode(id, "UTF-8")
    return Drilldown.renderToString(did, DataSetInfo.findDS(did)?.Companies?.paginate(Params['page']))
  }

  function table() : Object {
    return DataSetTableBody.renderToString(DataSetInfo.getAll(Session['username'] as String).paginate(Params['page'] ?: "1"))
  }

  override function create()  : Object {
    return null
  }

  override function _new()  : Object {
    return DataUpload.renderToString()
  }

  override function edit(id: String) : Object {
    return null
  }

  override function update(id: String) : Object {
    return null
  }

  function delete() {
    DataSetInfo.deleteAll(Params['id'], Session['username'] as String)
  }
}