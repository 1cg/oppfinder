package model

uses com.mongodb.DBCollection
uses com.mongodb.DB
uses java.lang.System
uses com.mongodb.MongoClient
uses com.mongodb.ServerAddress

class Database {

  static final var _INSTANCE : Database as readonly INSTANCE = new Database()

  final var CLIENT : MongoClient
  final var DB_NAME : String
  final var DB : DB

  private construct() {
    var host = System.Env['MONGO_HOST']
    DB_NAME = "oppFinder"
    if (host != null) {
      CLIENT = new MongoClient(new ServerAddress(host))
    } else {
      CLIENT = new MongoClient()
    }
    DB = CLIENT.getDB(DB_NAME)
  }

  function getCollection(collectionName : String) : DBCollection {
    //Iff not exists, create collection with default params
    return DB.createCollection(collectionName, null)
  }
}