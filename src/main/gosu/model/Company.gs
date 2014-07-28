package model

uses model.database.Document
uses util.iterable.SkipIterable
uses com.google.gson.reflect.TypeToken
uses com.google.gson.Gson

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
    return new Gson().fromJson(get('Policies') as String, new TypeToken<List<Policy>>(){}.getType())
  }

  property set Policies(policies : List<Policy>) {
    put('Policies', policies.toJSON())
  }

  static function findByJob(UUID : String) : SkipIterable<Company> {
    return Document.findMany(id, UUID, collection) as SkipIterable<Company>
  }

  static function findByJob(UUID : String, owner : String) : SkipIterable<Company> {
    return Document.findMany({id -> UUID, "Owner" -> owner}, collection) as SkipIterable<Company>
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