package model.database

uses java.util.Map
uses model.database.iterable.SkipIterable

interface DataSet {

  function first() : Map<String, Object>

  function findOne(query : Map<String, Object>) : Map<String, Object>

  function find(query : Map<String, Object>, values : Map<String, Object> = null) : SkipIterable<Map<String, Object>>

  function all() : SkipIterable<Map<String, Object>>

  function insert(values : Map<String, Object>) : ID

  function update(query : Map<String, Object>, values : Map<String, Object>)

  function remove(name : String, value : Object)

  function increment(query : Map<String, Object>, values : Map<String, Object>)

  function drop()

  property get Count() : long

  property get Name() : String

  property get IDName() : String

}