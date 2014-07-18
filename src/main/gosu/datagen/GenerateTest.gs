package datagen


uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses model.Company

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
  static function generateTest(collection : String, testVar : String, numCompanies : int = 20000) : List<Company> {
    var bigArray : List<Company> = {}
    for (1..numCompanies index j) {
      var company = new Company(collection)
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
      } else if (j == numCompanies -2) {
        var policy2 = new JSONObject()
        policy2.put("Type", "Property")
        policy2.put("Premium", "100")
        coPolicies.add(policy2)
        policy.put("Type", "Godzilla")
      } else {
        policy.put("Type", "Godzilla")
      }
      policy.put("Premium", "100")
      coPolicies.add(policy)
      company.put("Policies", coPolicies)
      bigArray.add(company)
    }
    return bigArray
  }
}