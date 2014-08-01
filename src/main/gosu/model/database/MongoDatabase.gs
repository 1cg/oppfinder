package model.database

uses com.mongodb.DB
uses java.lang.SuppressWarnings
uses com.mongodb.MongoURI
uses java.lang.System
uses com.mongodb.DBCollection

class MongoDatabase implements Database {

  static final var _INSTANCE : MongoDatabase as readonly INSTANCE = new MongoDatabase()
  final var DB_NAME : String
  final var DB : DB

  @SuppressWarnings("deprecation")
  private construct() {
    DB_NAME = System.Env['MONGO_NAME'] ?: 'oppFinder'
    var mongoURI = new MongoURI(System.Env["MONGO_HOST"]);
    DB = mongoURI.connectDB();
    DB.authenticate(mongoURI.getUsername(), mongoURI.getPassword());
  }

  override final function getDataSet(name: String): DataSet {
    //Iff not exists, create collection with default params
    return new MongoCollection(DB.createCollection(name, null))
  }

  final function getCollection(name: String): DBCollection {
    return DB.createCollection(name, null)
  }

  override property get IDName(): String {
    return '_id'
  }
}