package model

uses com.mongodb.Mongo
uses com.mongodb.DBCollection
uses com.mongodb.DB
uses java.lang.System

class Database {

  static final var _INSTANCE : Database as readonly INSTANCE = new Database()

  final var CLIENT : Mongo
  final var DB_NAME : String
  final var DB : DB

  private construct() {
    var host = System.Env['MONGO_HOST']
    if (host != null) {
      CLIENT = new Mongo(host)
    } else {
      CLIENT = new Mongo()
    }
    DB_NAME = "oppFinder"
    DB = CLIENT.getDB(DB_NAME)
  }

  function getCollection(collectionName : String) : DBCollection {
    //Iff not exists, create collection with default params
    return DB.createCollection(collectionName, null)
  }
}