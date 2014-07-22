package model

uses org.json.simple.JSONValue
uses org.json.simple.JSONArray
uses model.database.Document
uses util.iterable.SkipIterable

class Company extends Document {

  static var id : String as ForeignName = 'data_set_id'
  static var collection : String as Collection = 'companies'

  construct() {
    super()
  }

  construct(key : String, value : Object) {
    super(key, value)
  }

  property get DataSet() : String {
    return get(id) as String
  }

  property set DataSet(foreign : String) {
    put(id, foreign)
  }

  static function findByJob(UUID : String) : SkipIterable<Company> {
    return Document.findMany(id, UUID, collection) as SkipIterable<Company>
  }

  static function findByID(ID : long) : Company {
    return Document.find('longID', ID, collection) as Company
  }

  static property get CompanyDataTypes() : List<String> {
    return {"Company", "Contact Name", "Email", "Region", "Policies", "Reach", "Revenue", "Size"}
  }

  static function PolicyBreakdown(entryPolicy : String) : List<String>{
    var policies : List<String> = {}
    for (var o in (JSONValue.parse(entryPolicy) as JSONArray).map(\ o -> o as String)) {
      policies.add(o.replaceAll('\\{', '').replaceAll('\\}','').replaceAll('"',''))
    }
    return policies
  }

  static function validCollection(name : String) : boolean {
    return Document.find(id, name, collection) == null
  }

}