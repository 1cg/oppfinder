package model.database

uses com.mongodb.BasicDBObject

enhancement QueryBuilderEnhancement : com.mongodb.QueryBuilder {

  function toQuery() : BasicDBObject {
    return new BasicDBObject(this.get().toMap())
  }

}
