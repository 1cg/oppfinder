package util

uses model.DataSet
uses org.apache.mahout.cf.taste.impl.common.FastByIDMap
uses org.apache.mahout.cf.taste.model.PreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericPreference
uses java.lang.Long
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.model.GenericDataModel
uses org.bson.types.ObjectId
uses java.math.BigInteger

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
      var id = new BigInteger((new ObjectId(companyData['_id'] as String)).toHexString() , 16).longValue()
      ds.update({'_id' -> companyData['_id']}, {'longID' -> id})
      for (policy in companyPolicies index i) {
        var policyNum = policyToLong(policy)
        preferences.set(i,new GenericPreference(id as Long, policyNum, t1(companyData[field] as String)))
        if (t2 != null) preferences.set(i,new GenericPreference(id,policyNum, t2(companyData[field] as String)))
      }
      idMap.put(id, preferences)
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