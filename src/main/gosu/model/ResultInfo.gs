package model

uses util.Time
uses model.database.Document
uses util.iterable.SkipIterable
uses util.Time

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
    info.put('UUId', UUID)
    info.put('Source' , source)
    info.put('Created', Time.now())
    info.put('Owner', owner)
    info.save()
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
    return all(collection).map(\ o -> o.get('Name') as String)
  }

}