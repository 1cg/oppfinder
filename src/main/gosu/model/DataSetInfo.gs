package model

uses util.iterable.SkipIterable
uses util.TimeUtil
uses model.database.Document
uses input_helper.Json
uses java.util.Set
uses com.google.gson.reflect.TypeToken

class DataSetInfo extends Document {

  public static var _collection: String = "DataSetInfo"

  construct(key : String, value : Object) {
    super(_collection, key, value)
  }

  construct() {
    super(_collection)
  }

  static function register(collection : String, count : long, policies : Set<Policy>) {
    var info = new DataSetInfo()
    info.Created = TimeUtil.now()
    info.Size = count
    info.Name = collection
    info.Policies = policies
    info.save()
  }

  static property get All() : SkipIterable<DataSetInfo> {
    return all(_collection) as SkipIterable<DataSetInfo>
  }

  static property get AllNames() : List<String> {
    return all(_collection).map(\ o -> o.get('Name') as String)
  }

  static property get MostRecent() : DataSetInfo {
    return first(_collection) as DataSetInfo
  }

  property get Policies() : Set<Policy> {
    return Json.fromJSON(get('Policies') as String, new TypeToken<Set<Policy>>(){}.getType())
  }

  property set Policies(policies : Set<Policy>) {
    put('Policies', policies.toJSON())
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

  static function deleteAll(id : String) {
    for (company in Company.findByJob(id)) {
      company.delete()
    }
    Document.find('Name', id, _collection).delete()
  }

}