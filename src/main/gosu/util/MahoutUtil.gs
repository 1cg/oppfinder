package util

uses model.DataSet
uses org.apache.mahout.cf.taste.impl.common.FastByIDMap
uses org.apache.mahout.cf.taste.model.PreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericPreference
uses java.lang.Long
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.model.GenericDataModel

class MahoutUtil {

  static var policies = {'Business Auto' -> 1,
    'Property' -> 2,
    'Workers Comp' -> 3}

  static function toDataModel(ds : DataSet, field : String, transformation(f : String) : float) : DataModel {
    var fields = ds.find({}, {field -> 1, 'Policies' -> 1})
    var idMap = new FastByIDMap<PreferenceArray>()
    for (f in fields) {
      var companyPolicies = (f['Policies'] as String).split(",")
      var preferences = new GenericUserPreferenceArray(companyPolicies.length)
      for (policy in companyPolicies index i) {
        preferences.set(i,new GenericPreference(f['_id'] as Long ,policyToLong(policy), transformation(f['field'] as String)))
      }
      idMap.put(f['_id'] as Long, preferences)
    }
    return new GenericDataModel(idMap)
  }

  static function policyToLong(policy : String) : long {
    return policies[policy.split("=")[0]]
  }

  static function longToPolicy(mapping : long) : String {
    for (entry in policies.entrySet()) {
      if (entry.Value == mapping) {
        return entry.Key
      }
    }
    return null
  }


}