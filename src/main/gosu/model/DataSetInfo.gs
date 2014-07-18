package model

uses util.iterable.SkipIterable
uses util.TimeUtil
uses model.database.MongoCollection
uses model.database.Document

class DataSetInfo extends Document {

  public static var REGION_COORDINATES : String = "regionCoordinates"
  public static var MASTER_DATA_SET : String = "masterDataSet" // MongoCollection of DataSets to refer to
  var myDataSet : MongoCollection

  construct(key : String, value : Object) {
    super(MASTER_DATA_SET, key, value)
  }

  construct() {
    super(MASTER_DATA_SET)
  }

  static function register(collection : String, count : long) {
    var info = new DataSetInfo()
    info.Created = TimeUtil.now()
    info.Size = count
    info.Name = collection
    info.save()
  }

  static property get All() : SkipIterable<DataSetInfo> {
    return all(MASTER_DATA_SET) as SkipIterable<DataSetInfo>
  }

  static property get AllNames() : List<String> {
    return all(MASTER_DATA_SET).map(\ o -> o.get('Name') as String)
  }

  static function find(id : String) : SkipIterable<Company> {
    return findMany(Company.ForeignName, id, Company.Collection) as SkipIterable<Company>
  }

  static property get MostRecent() : DataSetInfo {
    return first(MASTER_DATA_SET) as DataSetInfo
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

}