package util

uses org.apache.mahout.cf.taste.impl.common.FastByIDMap
uses org.apache.mahout.cf.taste.model.PreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericPreference
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.model.GenericDataModel
uses java.util.Map
uses java.lang.Integer
uses java.util.concurrent.locks.ReentrantLock
uses model.DataSetInfo
uses model.Policy

class MahoutUtil {

  static final var _LOCK = new ReentrantLock()
  static var MODEL_MAP : Map<String, DataModel> = {}
  static var MODEL_COUNT : Map<String, Integer> = {}

  static function toDataModel(collection : String, field : String, t1 : block(f : String) : float, t2 : block(f : String) : float = null) : DataModel {
    var lookup = collection + field
    using(_LOCK) {
      if (MODEL_MAP[lookup] != null) {
        MODEL_COUNT[lookup] = MODEL_COUNT[lookup] + 1
        return MODEL_MAP[lookup]
      }
      print(collection)
      var info = DataSetInfo.findDS(collection)
      var policies = makePolicyMap(info.Policies)
      var idMap = new FastByIDMap<PreferenceArray>()
      for (company in info.Companies) {
        var preferences = new GenericUserPreferenceArray(company.Policies.Count * (t2 == null ? 1 : 2))
        var id = (company.get('longID') as String).toLong()
        for (policy in company.Policies index i) { //Map each field to a long value and then add it as a preference
          preferences.set(i,new GenericPreference(id, policies[policy], t1(company.get(field) as String)))
          if (t2 != null) preferences.set(company.Policies.Count,new GenericPreference(id,policies[policy], t2(company.get(field) as String)))
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
  * Takes a long value that has been mapped from makePolicyMap and maps its back to a policy
  * longToPolicy(policyToLong(<<My Valid Policy>>)) == <<My Valid Policy>>
   */
  static function longToPolicy(policies : Map<Policy, Integer>, mapping : long) : String {
    for (entry in policies.entrySet()) {
      if (entry.Value == mapping) {
        return entry.Key.Policy
      }
    }
    return null
  }

  static function makePolicyMap(policies : List<Policy>) : Map<Policy, Integer> {
    var policyMap : Map<Policy,Integer> = {}
    for (policy in policies index i) {
      policyMap[policy] = i
    }
    return policyMap
  }

}