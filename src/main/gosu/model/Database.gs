package model

uses com.mongodb.DBCollection
uses com.mongodb.DB
uses java.lang.System
uses com.mongodb.MongoURI
uses java.lang.SuppressWarnings

class Database {

  static final var _INSTANCE : Database as readonly INSTANCE = new Database()

  final var DB_NAME : String
  final var DB : DB

  @SuppressWarnings("deprecation")
  private construct() {
    DB_NAME = "oppFinder"
    var mongoURI = new MongoURI(System.getenv("MONGO_HOST"));
    DB = mongoURI.connectDB();
    DB.authenticate(mongoURI.getUsername(), mongoURI.getPassword());
  }

  function getCollection(collectionName : String) : DBCollection {
    //Iff not exists, create collection with default params
    return DB.createCollection(collectionName, null)
  }
}