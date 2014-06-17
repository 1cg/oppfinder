package util

uses model.DataSet
uses org.apache.mahout.cf.taste.impl.common.FastByIDMap
uses org.apache.mahout.cf.taste.model.PreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray
uses org.apache.mahout.cf.taste.impl.model.GenericPreference
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.model.GenericDataModel
uses org.bson.types.ObjectId
uses java.math.BigInteger
uses java.util.Map
uses java.lang.Integer
uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses datagen.assets.AssetLibrarian

class MahoutUtil {

  static final var policies = makePolicyMap()
  static var assetLibrarian = new AssetLibrarian()

  static function toDataModel(ds : DataSet, field : String, t1(f : String) : float, t2(f : String) : float) : DataModel {
    print("wtf")

    var companies = ds.find({}, {field -> 1, 'Policies' -> 1}) //Find the field and policies for each company
    var idMap = new FastByIDMap<PreferenceArray>()
    for (companyData in companies) {
      var companyPolicies = companyData['Policies'] as JSONArray
      var preferences = new GenericUserPreferenceArray(companyPolicies.size() * 2)
      var id = new BigInteger((new ObjectId(companyData['_id'] as String)).toHexString() , 16).longValue()
      ds.update({'_id' -> companyData['_id']}, {'longID' -> id})  //Add our calculated id to the database for lookup
      for (policy in companyPolicies.map(\ o -> o as JSONObject) index i) { //Map each field to a long value and then add it as a preference
        var data = companyData[field]
        preferences.set(i,new GenericPreference(id, policyToLong(policy), t1(companyData[field] as String)))
        if (t2 != null) preferences.set(i+companyPolicies.size(),new GenericPreference(id,policyToLong(policy), t2(companyData[field] as String)))
      }
      idMap.put(id, preferences)
    }
    return new GenericDataModel(idMap)
  }

  /*
  * Takes a policy and maps it to a long value for analysis by the mahout library
   */
  static function policyToLong(policy : JSONObject) : long {
    return policies[policy['type'] as String]
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
    print("wtf,mate")
    var policyMap : Map<String,Integer> = {}
    print("wtf,mate!")

    print(assetLibrarian.POLICIES)
    print("wtf,mate!!!")

    for (policy in assetLibrarian.POLICIES index i) {
      policyMap[policy] = i
    }
    return policyMap
  }

}