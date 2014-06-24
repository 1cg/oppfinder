package model

uses com.mongodb.DBCollection
uses com.mongodb.DB
uses java.lang.System
uses com.mongodb.MongoClient
uses com.mongodb.MongoClientURI

class Database {

  static final var _INSTANCE : Database as readonly INSTANCE = new Database()

  var CLIENT : MongoClient
  final var DB_NAME : String
  final var DB : DB

  private construct() {
    var host = System.Env['MONGO_HOST']
    DB_NAME = "oppFinder"
    if (host != null) {
      var uri = new MongoClientURI(host)
      print(uri.Credentials.UserName)
      print(uri.Credentials.Password)
      print(uri.Database)
      print(uri.Collection)
      print(uri.Hosts)
      CLIENT = new MongoClient(uri)
    } else {
      throw "MONGO_HOST not set"
    }
    DB = CLIENT.getDB(DB_NAME)
  }

  function getCollection(collectionName : String) : DBCollection {
    //Iff not exists, create collection with default params
    return DB.createCollection(collectionName, null)
  }
}