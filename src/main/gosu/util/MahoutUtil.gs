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

  static function toDataModel(ds : DataSet, field : String, transformation(f : String) : float) : DataModel {
    var fields = ds.find({}, {field -> 1, 'Policies' -> 1})
    var idMap = new FastByIDMap<PreferenceArray>()
    for (f in fields) {
      var policies = (f['Policies'] as String).split(",")
      var preferences = new GenericUserPreferenceArray(policies.length)
      for (policy in policies index i) {
        preferences.set(i,new GenericPreference(f['_id'] as Long ,policyMap(policy), transformation(f['field'] as String)))
      }
      idMap.put(f['_id'] as Long, preferences)
    }
    return new GenericDataModel(idMap)
  }

  static function policyMap(policy : String) : long {
    var policies = {'Business Auto' -> 1,
                    'Property' -> 2,
                    'Workers Comp' -> 3}
    return policies[policy.split("=")[0]]
  }

}