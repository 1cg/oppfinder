package model

uses com.mongodb.DBCollection
uses com.mongodb.DB
uses java.lang.System
uses com.mongodb.MongoClient
uses com.mongodb.MongoCredential
uses com.mongodb.ServerAddress

class Database {

  static final var _INSTANCE : Database as readonly INSTANCE = new Database()

  final var CLIENT : MongoClient
  final var DB_NAME : String
  final var DB : DB

  private construct() {
    var host = System.Env['MONGO_HOST']
    var pwd = System.Env['MONGO_PWD']
    var user = System.Env['MONGO_USER']
    DB_NAME = "oppFinder"
    var cred = MongoCredential.createMongoCRCredential(user,DB_NAME,pwd.toCharArray())
    if (host != null) {
      CLIENT = new MongoClient(new ServerAddress(host), {cred})
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