package model.database

uses java.io.Serializable

/*
* This acts as a container class to wrap the unique key for a data item in a data set. In
* SQL this would be a primary key. In MongoDB this would be the ObjectID
 */
class ID implements Serializable {

  var _id : Object as readonly ID

  construct(id : Object) {
    _id = id
  }

}