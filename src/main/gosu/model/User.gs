package model

uses model.database.Document

class User extends Document {

  static var _collection : String = 'users'

  construct() {
    super()
  }

  construct(key : String, value : Object) {
    super(key, value)
  }

  property get Name() : String {
    return get('Name') as String
  }

  property set Name(name : String) {
    put('Name', name)
  }

  static function find(name : String) : User {
    return Document.find('Name', name, _collection) as User
  }

}