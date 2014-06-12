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

  static function toDataModel(ds : DataSet, field : String, t1(f : String) : float, t2(f : String) : float) : DataModel {
    var companies = ds.find({}, {field -> 1, 'Policies' -> 1})
    var idMap = new FastByIDMap<PreferenceArray>()
    for (companyData in companies) {
      var companyPolicies = (companyData['Policies'] as String).split(",")
      var preferences = new GenericUserPreferenceArray(companyPolicies.length * 2)
      for (policy in companyPolicies index i) {
        preferences.set(i,new GenericPreference(companyData['_id'] as Long ,policyToLong(policy), t1(companyData[field] as String)))
        if (t2 != null) preferences.set(i,new GenericPreference(companyData['_id'] as Long ,policyToLong(policy), t2(companyData[field] as String)))
      }
      idMap.put(companyData['_id'] as Long, preferences)
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