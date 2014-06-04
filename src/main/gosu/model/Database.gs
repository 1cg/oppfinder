package model

uses com.mongodb.Mongo
uses com.mongodb.DB
uses com.mongodb.DBCollection

class Database {

  var _client : Mongo
  var _db : DB

  construct(dbName :String) {
    _client = new Mongo()
    _db = _client.getDB(dbName)
  }

  function getDataSet(collectionName : String) : DataSet {
    //Iff not exists, create collection with default params
    return new DataSet(_db.createCollection(collectionName, null))
  }
}