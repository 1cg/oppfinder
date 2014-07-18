package model

uses java.util.Map
uses org.json.simple.JSONArray
uses org.json.simple.JSONValue
uses org.json.simple.JSONObject
uses util.iterable.SkipIterable
uses util.TimeUtil
uses com.mongodb.BasicDBObject
uses util.iterable.TransformIterable
uses model.database.MongoCollection

class Results {

  //TODO --Make this extend document properly
  static var DS = new MongoCollection('RECOMMENDATION_RESULTS_COLLECTION')

  static function addResults(UUID : String, results : List<Map<Object,Object>>, source : String) {
    DS.insert({'UUId' -> UUID,
               'Results' -> results,
               'Source'  -> source,
               'created' -> TimeUtil.now()})
  }

  static function getResults(UUID : String) : List<Map<Object,Object>> {
    var results = DS.findOne(new BasicDBObject('UUId', UUID))?['Results'] as String
    var jArray = results == null ? null : JSONValue.parse(results) as JSONArray
    return jArray?.map(\ o -> o as JSONObject)
  }

  static function getSource(UUID : String) : String {
    return DS.findOne(new BasicDBObject('UUId', UUID))?['Source'] as String
  }

  static property get AllResults() : SkipIterable<Map<String,Object>> {
    return new TransformIterable<Map<String, Object>>(DS.find().Cursor, \ o -> o as BasicDBObject)
  }

  static property get AllResultsNames() : List<String> {
    return DS.find().map(\ o -> o['UUId'] as String)
  }

}