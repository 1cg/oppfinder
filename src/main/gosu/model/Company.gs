package model

uses model.database.Document
uses util.iterable.SkipIterable
uses java.util.Set

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

  property get Policies() : List<Policy> {
    //TODO - Change this back
    return {new Policy('Workers Comp', 10), new Policy('Business Auto', 10) , new Policy('Property',10),  new Policy('Earthquake', 10), new Policy('Tsunami', 10), new Policy('Godzilla', 10)}
    //return Json.fromJSON(get('Policies') as String, new TypeToken<List<Policy>>(){}.getType())
  }

  property set Policies(policies : List<Policy>) {
    //TODO - Change this back
    put('Policies', policies.toString())
    //put('Policies', policies.toJSON())
  }

  property get AnalyzableFields() : Set<String> {
    var fields = AllFields
    fields.remove(id)
    fields.remove('Policies')
    fields.remove('longID')
    fields.remove('Company')
    return fields
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

  static function validCollection(name : String) : boolean {
    return Document.find(id, name, collection) == null
  }

}