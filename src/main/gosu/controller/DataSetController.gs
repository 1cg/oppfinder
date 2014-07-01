package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses view.Layout
uses view.Companies
uses view.DataSetTable
uses model.DataSetEntry

class DataSetController implements IHasRequestContext, IResourceController {

// GET root. Should be list of existing DataSets
  override function index() {
    Writer.append(Layout.renderToString(DataSetTable.renderToString())) // LATER come back to this and paginate it
  }



  // POST root
  // Creates a new DataSet
  override function create() {
  }

  // GET root/:id
  // datasets/id_of_dataset/page
  // This guy should display a single DataSet and list its companies
  override function show(id: String) {
    Writer.append(Layout.renderToString(Companies.renderToString(1, id, DataSetEntry.FindDataSet(id).paginate(Params['page']))))
  }



  // GET root/new
  override function _new() {
  }
  // GET root/:id/edit
  override function edit(id: String) {
  }


  // PUT or POST root/:id
  override function update(id: String) {
  }
}