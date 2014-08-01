package model.database

interface Database {

  function getDataSet(name : String) : DataSet

  property get IDName() : String

}