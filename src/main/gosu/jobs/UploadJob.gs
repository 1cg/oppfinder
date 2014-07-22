package jobs

uses org.json.simple.JSONArray
uses org.json.simple.parser.JSONParser
uses model.Company
uses org.json.simple.JSONObject
uses java.util.UUID
uses java.util.Map
uses model.database.Document
uses model.DataSetInfo

class UploadJob extends Job {

  construct(key : String, value : Object) {
    super(key,value)
  }

  construct(body : String) {
    Data = body
    DataSetCollection = UUID.randomUUID().toString()
  }

  override function executeJob() {
    checkCancellation()
    var data = Data
    data = data.substring(0, data.lastIndexOf("\n---"))
    if (data.length < 6) {
      this.Progress = 100
      return
    }
    var array = new JSONParser().parse(data) as JSONArray
    checkCancellation()
    var iterations = array.size()
    for (companyObject in array index i) {
      var company = new Company()
      company.putAll((companyObject as JSONObject) as Map<String, Object>)
      company.DataSet = UUId
      company.save()
      checkCancellation()
      this.Progress = (i*100)/iterations
    }
    DataSetInfo.register(DataSetCollection, Document.findMany(Company.ForeignName, DataSetCollection, Company.Collection).Count)
    this.Progress = 100
  }

  property get Data() : String {
    return get('Data') as String
  }

  property set Data(data : String) {
    put('Data',data)
  }

  property get DataSetCollection() : String {
    var ds = get('DataSetCollection') as String
    if (ds == null) { //If we weren't provided a collection, generate one
      ds = UUID.randomUUID().toString()
      DataSetCollection = ds
    }
    return ds
  }

  property set DataSetCollection(collection : String) {
    put('DataSetCollection', collection)
  }

  override function doReset() {}

  override function renderToString() : String {
    return view.datasets.DataSetTable.renderToString(model.DataSetInfo.All.paginate("1"))
  }

}