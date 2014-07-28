package model

uses util.iterable.SkipIterable
uses util.Time
uses model.database.Document
uses input_helper.Json
uses java.util.Set
uses com.google.gson.reflect.TypeToken

class DataSetInfo extends Document {

  final static var _collection: String as Collection = "DataSetInfo"

  construct(key : String, value : Object) {
    super(_collection, key, value)
  }

  construct() {
    super(_collection)
  }

  static function register(collection : String, count : long, policies : List<Policy>, fields : Set<String>, owner : String) : DataSetInfo {
    var info = new DataSetInfo()
    info.Created = Time.now()
    info.Size = count
    info.Name = collection
    info.Policies = policies
    info.Owner = owner
    info.Fields = fields
    info.save()
    return info
  }

  static function findDS(name : String) : DataSetInfo {
    return Document.find('Name', name, _collection) as DataSetInfo
  }

  static function getAll(owner : String) : SkipIterable<DataSetInfo> {
    return findMany('Owner', owner, _collection) as SkipIterable<DataSetInfo>
  }

  static property get AllNames() : List<String> {
    return all(_collection).map(\ o -> o.get('Name') as String)
  }

  static property get MostRecent() : DataSetInfo {
    return first(_collection) as DataSetInfo
  }

  property get Policies() : List<Policy> {
    return Json.fromJSON(get('Policies') as String, new TypeToken<List<Policy>>(){}.getType())
  }

  property set Policies(policies : List<Policy>) {
    put('Policies', policies.toJSON())
  }

  property get Owner() : String {
    return get('Owner') as String
  }

  property set Owner(name : String) {
    print("setting dataset owner now!: " + name)
    put('Owner', name)
  }

  property get Companies() : SkipIterable<Company> {
    return Company.findByJob(Name)
  }

  property get Fields() : Set<String> {
    return Json.fromJSON(get('Fields') as String, new TypeToken<Set<String>>(){}.getType())
  }

  property set Fields(fields : Set<String>) {
    put('Fields', fields.toJSON())
  }


  property get AnalyzableFields() : Set<String> {
    var fields = Fields
    fields.remove(Company.ForeignName)
    fields.remove('Policies')
    fields.remove('longID')
    fields.remove('Company')
    return fields
  }
  
  property get Name() : String {
    return get('Name') as String
  }

  property set Name(name : String) {
    put('Name', name)
  }

  property get Size() : long {
    return (get('Size') as String).toLong()
  }

  property set Size(size : long) {
    put('Size', size)
  }

  property get Created() : String {
    return get('Created') as String
  }

  property set Created(time : String) {
    put('Created', time)
  }

  static function deleteAll(id : String, owner : String) {
    for (company in Company.findByJob(id, owner)) {
      company.delete()
    }
    Document.find('Name', id, _collection).delete()
  }

}