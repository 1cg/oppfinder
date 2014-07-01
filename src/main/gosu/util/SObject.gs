package util

uses java.util.Map

class SObject {
  var _type : String
  var _args : Map<String, String>

  construct(type: String, args : Map<String, String>) {
    _args = args
    _type = type
  }

  //getters and setters for each type

}