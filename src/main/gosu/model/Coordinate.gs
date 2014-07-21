package model

uses model.database.Document

class Coordinate extends Document {

  static var collection : String as readonly Collection = 'coordinates'

  construct() {
    super()
  }

  construct(key : String, value : Object) {
    super(key,value)
  }

}