package datagen


uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses java.io.FileWriter
uses java.io.File
class GenerateReachTest {

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
  /*
   * Generates JSON of companies with arbitrary details except for two companies with clear similarities in
   * reach. The Recommendation Job should recommend company RECOMMENDEE to policy DESIREDPOLICY
   */
  function generateReachTest(output : String) {
    print(output)
    var bigArray = new JSONArray()
    for (name in companies index i) {
      var company = new JSONObject()
      company.put("Company", name)
      company.put("Contact Name", controlVariables["Contact Name"])
      company.put("Email", controlVariables["Email"])
      company.put("Region", controlVariables["Region"])
      company.put("Revenue", 100)
      company.put("Size", 100)

      if(name == "RECOMMENDER (match)" || name == "RECOMMENDEE (test success)") {
        company.put("Reach", "Global")

      } else {
        company.put("Reach", controlVariables["Reach"])
      }

      var coPolicies = new JSONArray();
      var policy = new JSONObject()
      if(name == "RECOMMENDER (match)") {
        policy.put("Type", "Property")
      } else {
        policy.put("Type", "Godzilla")
      }
      policy.put("Premium", 100)
      coPolicies.add(policy)
      company.put("Policies", coPolicies)
      if (i == 6) {
        for (j in 0..10000) {
          bigArray.add(company)
        }
      }
      bigArray.add(company)
    }
    var outputFile = new FileWriter(new File(output))
    outputFile.write(bigArray.toJSONString())
    outputFile.flush()
    outputFile.close()
  }
}