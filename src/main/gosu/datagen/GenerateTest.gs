package datagen


uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses model.MongoCollection

class GenerateTest {

  static final var controlVariables = {
      "Contact Name" -> "john doe",
      "Email" -> "johndoe@email",
      "Region" -> "Alexandria, VA, USA",
      "Reach" -> "Regional",
      "Revenue" -> "10",
      "Size" -> "50"
  }

  static final var independentVariables = {
      "Region" -> "Berkeley, CA, USA",
      "Reach" -> "Global",
      "Revenue" -> "10000",
      "Size" -> "10000"
  }

  /*
   * Generates JSON of companies with arbitrary details except for two companies with clear similarities in
   * reach. The Recommendation Job should recommend company RECOMMENDEE to GODZILLA
   */
  function generateTest(output : String, testVar : String, numCompanies : int = 20000) {
    var bigArray = new JSONArray()
    for (1..numCompanies index j) {
      var company = new JSONObject()

      if (j == numCompanies-1) {
        company.put("Company", "RECOMMENDEE (test success)")
      } else if (j == numCompanies-2) {
        company.put("Company", "RECOMMENDER")
      } else {
        company.put("Company", "Control")
      }
      for (key in controlVariables.keySet()) {
        if (key == testVar && (j == numCompanies-1 || j == numCompanies-2)) {
          // INDEPENDENT VARIABLE
          company.put(key, independentVariables[key])
        } else {
          company.put(key, controlVariables[key])
        }
      }
      var coPolicies = new JSONArray()
      var policy = new JSONObject()
      if(j == numCompanies-1) {
        policy.put("Type", "Property")
      } else {
        policy.put("Type", "Godzilla")
      }
      policy.put("Premium", "100")
      coPolicies.add(policy)
      company.put("Policies", coPolicies)
      bigArray.add(company)
    }
    var ds = new MongoCollection(output)
    for (o in bigArray) {
      ds.insert(o as JSONObject)
    }
  }
}