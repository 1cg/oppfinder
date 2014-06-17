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

      bigArray.add(company)
    }
    var outputFile = new FileWriter(new File("src/main/gosu/"+output))
    outputFile.write(bigArray.toJSONString())
    outputFile.flush()
    outputFile.close()
  }


   /* var columnMap = AssetLibrarian.INSTANCE.COLUMNMAP
    var rand = new Random()
    var dataMap = new HashMap<String, List>()
    for (column in columnMap.Keys) {
      var data = new LinkedList<String>()
      var input = new FileReader("src/main/gosu/datagen/assets/"+columnMap.get(column))
      var bufRead = new BufferedReader(input)
      var myLine = bufRead.readLine()

      while (myLine != null) {
        data.add(myLine)
        myLine = bufRead.readLine()
      }
      dataMap.put(column, data)
    }


    var bigArray = new JSONArray()
    for (name in dataMap.get("Company") index i) {
      var company = new JSONObject()
      company.put("Company", dataMap.get("Company").get(i % dataMap.get("Company").size()) as String)
      company.put("Contact Name", dataMap.get("Contact Name").get(i % dataMap.get("Contact Name").size()) as String)
      company.put("Email", dataMap.get("Email").get(i % dataMap.get("Email").size()) as String)
      company.put("Region", dataMap.get("Region").get(rand.nextInt(dataMap.get("Region").size())) as String)
      company.put("Reach", dataMap.get("Reach").get(rand.nextInt(dataMap.get("Reach").size())) as String)
      var coPolicies = new JSONArray();
      for (policyType in dataMap.get("Policy") index j) {
        if (rand.nextInt(2) == 0 || j+1 == dataMap.get("Policy").size()) {
          var policy = new JSONObject()
          policy.put("Type", policyType as String)
          policy.put("Premium", (5000 + rand.nextInt(999500)))
          coPolicies.add(policy)
        } else {
          continue
        }
      }
      company.put("Policies", coPolicies)

      company.put("Revenue", (new BigDecimal(10 + rand.nextInt(162000))).toString())
      company.put("Size", (50 + rand.nextInt(40000)) as String)

      bigArray.add(company)
    }

    for (1..80 index j) {
      var company = new JSONObject()
      company.put("Company", "MATCHING COMPANY"+j)
      company.put("Contact Name", "lol"+j)
      company.put("Email", "lol"+j)
      company.put("Region", "Aberdeen, Aberdeen City, UK")
      company.put("Revenue", "100"+j)
      company.put("Size", "50000")
      company.put("Reach", "Independent Variable")
      var coPolicies = new JSONArray();
      var policy = new JSONObject()
      if (j < 25) {
        policy.put("Type", "trainer (SUCCESS)")
      } else {
        policy.put("Type", "trainee")
      }
      policy.put("Premium", 5000)
      coPolicies.add(policy)
      company.put("Policies", coPolicies)
      bigArray.add(company)
    }

*/

}