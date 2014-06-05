package model

uses com.mongodb.Mongo
uses com.mongodb.DBCollection

class Database {

  static final var CLIENT = new Mongo()
  static final var DB_NAME = "oppFinder"
  static final var DB = CLIENT.getDB(DB_NAME)

  static function getCollection(collectionName : String) : DBCollection {
    //Iff not exists, create collection with default params
    return DB.createCollection(collectionName, null)
  }
}