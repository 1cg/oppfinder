package model

uses model.database.Document

class RefreshToken extends Document {

  static var _collection : String = 'RefreshToken'

  construct() {
    super(_collection)
  }

  construct(key : String, value : Object) {
    super(_collection ,key, value)
  }

  property get Token() : String {
    return get('RefreshToken') as String
  }

  property set Token(token : String) {
    put('RefreshToken', token)
  }

  static property get RefreshToken() : RefreshToken {
    return Document.first(_collection) as RefreshToken
  }

}