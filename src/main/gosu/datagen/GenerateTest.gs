package datagen


uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses java.lang.System
uses java.io.FileWriter
uses java.io.File

class GenerateTest {

  static final var companies = {"RECOMMENDER (match)", "RECOMMENDEE (test success)",
      "control1", "control2", "control3", "control4",
      "control5", "control6", "control7", "control8"}
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
   * reach. The Recommendation Job should recommend company RECOMMENDEE to policy DESIREDPOLICY
   */
  function generateTest(output : String, testVar : String) {
    print(output)
    var bigArray = new JSONArray()
    for (1..400 index j) {
      var company = new JSONObject()

      if (j == 10) {
        company.put("Company", "RECOMMENDEE (test success)")
      } else if (j == 11) {
        company.put("Company", "RECOMMENDER")
      } else {
        company.put("Company", "foo")
      }
      for (key in controlVariables.keySet()) {
        if (key == testVar && (j == 10 || j == 11)) { // only the recommendee (this needs to be changed)
          // INDEPENDENT VARIABLE
          company.put(key, independentVariables[key])
        } else {
          company.put(key, controlVariables[key])
        }
      }
      var coPolicies = new JSONArray()
      var policy = new JSONObject()
      if(j == 10) {
        policy.put("Type", "Property")
      } else {
        policy.put("Type", "Godzilla")
      }
      policy.put("Premium", "100")
      coPolicies.add(policy)
      company.put("Policies", coPolicies)
      bigArray.add(company)
    }
    var outputFile = new FileWriter(new File("src/main/gosu/" + output))
    outputFile.write(bigArray.toJSONString())
    outputFile.flush()
    outputFile.close()
  }
}