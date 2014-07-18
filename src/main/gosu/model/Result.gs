package model

uses model.database.Document
uses util.iterable.SkipIterable
uses java.util.Comparator
uses java.lang.Float

class Result extends Document {

  static var collection : String = 'results'

  construct(key : String, value : Object) {
    super(key, value)
  }

  construct() {
    super()
  }

  static function find(id : String) : SkipIterable<Result> {
    return Document.findMany(collection, 'ResultSet', id) as SkipIterable<Result>
  }

  property get Key() : String {
    return User+ItemID
  }

  property get User() : String {
    return get('User') as String
  }

  property set User(key : String) {
    put('User', key)
  }

  property get ItemID() : long {
    return (get('ItemID') as String).toLong()
  }

  property set ItemID(value : long) {
    put('ItemID', value)
  }

  property get Value() : Float {
    return (get('Value') as String).toFloat()
  }

  property set Value(value : Float) {
    put('Value', value)
  }

  property get ResultSet() : String {
    return get('ResultSet') as String
  }

  property set ResultSet(resultSet : String) {
    put('ResultSet', resultSet)
  }

  static class ResultComparator implements Comparator<Result> {

    override function compare(o1 : Result, o2 : Result) : int {
      return o2.Value.compareTo(o2.Value)
    }
  }

}