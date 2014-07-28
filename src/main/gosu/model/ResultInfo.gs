package model

uses util.Time
uses model.database.Document
uses util.iterable.SkipIterable

class ResultInfo extends Document {

  static var collection = 'ResultsInfo'

  construct(key : String, value : Object) {
    super(collection, key, value)
  }

  private construct() {
    super(collection)
  }

  static function addResults(UUID : String, source : String, owner : String) {
    var info = new ResultInfo()
    info.UUId = UUID
    info.Source = source
    info.Created = Time.now()
    info.Owner = owner
    info.save()
  }

  property get UUId() : String {
    return get('UUId') as String
  }

  property set UUId(UUID : String) {
    put('UUId', UUID)
  }

  property get Source() : String {
    return get('Source') as String
  }

  property set Source(source : String) {
    put('Source', source)
  }

  property get Created() : String {
    return get('Created') as String
  }

  property set Created(created : String) {
    put('Created', created)
  }

  property get Owner() : String {
    return get('Owner') as String
  }

  property set Owner(owner : String) {
    put('Owner', owner)
  }

  static function findResults(UUID : String) : List<Result> {
    return Result.find(UUID).toList()
  }

  static function getSource(UUID : String) : String {
    return Document.find('UUId', UUID, collection).get('Source') as String
  }

  static function getAll(owner : String) : SkipIterable<ResultInfo> {
    return Document.findMany({'Owner' -> owner}, collection) as SkipIterable<ResultInfo>
  }

  static property get AllResultsNames() : List<String> {
    return all(collection).map(\ r -> (r as ResultInfo).UUId as String)
  }

}