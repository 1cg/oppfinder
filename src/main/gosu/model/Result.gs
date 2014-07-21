package model

uses model.database.Document
uses util.iterable.SkipIterable
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
    return Document.findMany('ResultSet', id, collection) as SkipIterable<Result>
  }

  property get Key() : String {
    return User + "" + ItemID
  }

  property get User() : long {
    return (get('User') as String).toLong()
  }

  property set User(key : long) {
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

  property get Company() : String {
    return get('Company') as String
  }

  property set Company(company : String) {
    put('Company', company)
  }

  property get ResultSet() : String {
    return get('ResultSet') as String
  }

  property set ResultSet(resultSet : String) {
    put('ResultSet', resultSet)
  }

}