package util

uses org.apache.mahout.cf.taste.impl.common.FastByIDMap
uses org.apache.mahout.cf.taste.model.PreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericPreference
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.model.GenericDataModel
uses java.util.Map
uses java.lang.Integer
uses org.json.simple.JSONObject
uses org.json.simple.JSONValue
uses java.util.concurrent.locks.ReentrantLock
uses model.database.MongoCollection
uses org.json.simple.JSONArray

class MahoutUtil {

  static final var policies = makePolicyMap()
  static final var _LOCK = new ReentrantLock()
  static var MODEL_MAP : Map<String, DataModel> = {}
  static var MODEL_COUNT : Map<String, Integer> = {}

  static function toDataModel(ds : MongoCollection, field : String, t1 : block(f : String) : float, t2 : block(f : String) : float = null) : DataModel {
    var lookup = ds.Name + field
    using(_LOCK) {
      if (MODEL_MAP[lookup] != null) {
        MODEL_COUNT[lookup] = MODEL_COUNT[lookup] + 1
        return MODEL_MAP[lookup]
      }
      var companies = ds.find({}, {field -> 1, 'Policies' -> 1, 'longID' -> 1}) //Find the field and policies for each company
      var idMap = new FastByIDMap<PreferenceArray>()
      for (companyData in companies) {
        var companyPolicies = JSONValue.parse(companyData['Policies'] as String) as JSONArray
        var preferences = new GenericUserPreferenceArray(companyPolicies.size() * (t2 == null ? 1 : 2))
        var id = (companyData['longID'] as String).toLong()
        for (policy in companyPolicies.map(\ o -> o as JSONObject) index i) { //Map each field to a long value and then add it as a preference
          preferences.set(i,new GenericPreference(id, policyToLong(policy), t1(companyData[field] as String)))
          if (t2 != null) preferences.set(i+companyPolicies.size(),new GenericPreference(id,policyToLong(policy), t2(companyData[field] as String)))
        }
        idMap.put(id, preferences)
      }
      var model = new GenericDataModel(idMap)
      MODEL_MAP[lookup] = model
      MODEL_COUNT[lookup] = 1
      return model
    }
  }

  static function releaseDataModel(field : String, collection : String) {
    var lookup = collection + field
    using(_LOCK) {
      var count = MODEL_COUNT[lookup]
      count--
      if (count == 0) {
        MODEL_MAP.remove(lookup)
      } else {
        MODEL_COUNT[lookup] = count
      }
    }
  }

  /*
  * Takes a policy and maps it to a long value for analysis by the mahout library
   */
  static function policyToLong(policy : JSONObject) : long {
    return policies[policy['Type'] as String]
  }

  /*
  * Takes a long value that has been mapped from makePolicyMap and maps its back to a policy
  * longToPolicy(policyToLong(<<My Valid Policy>>)) == <<My Valid Policy>>
   */
  static function longToPolicy(mapping : long) : String {
    for (entry in policies.entrySet()) {
      if (entry.Value == mapping) {
        return entry.Key
      }
    }
    return null
  }

  static function makePolicyMap() : Map<String, Integer> {
    var policyMap : Map<String,Integer> = {}
    for (policy in AssetLibrarian.INSTANCE.POLICIES index i) {
      policyMap[policy] = i
    }
    return policyMap
  }

}