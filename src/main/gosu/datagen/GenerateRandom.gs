package datagen

uses java.util.HashMap
uses java.util.Random
uses java.util.LinkedList
uses java.io.FileReader
uses java.io.BufferedReader
uses org.json.simple.JSONObject
uses java.math.BigDecimal
uses org.json.simple.JSONArray
uses util.AssetLibrarian
uses model.Company

class GenerateRandom {
  /*
   * Generates JSON of random companies with random information about them.
   * Number of companies is dependent on the length of Companies.txt
   * output : The file path to write and place the JSON file.
   */
  static function generateRandom() : List<Company>{
    var columnMap = AssetLibrarian.INSTANCE.COLUMNMAP
    var rand = new Random()
    var dataMap = new HashMap<String, List>()
    for (column in columnMap.Keys) {
      var data = new LinkedList<String>()
      var input = new FileReader(AssetLibrarian.INSTANCE.getPath(columnMap.get(column)))
      var bufRead = new BufferedReader(input)
      var myLine = bufRead.readLine()

      while (myLine != null) {
        data.add(myLine)
        myLine = bufRead.readLine()
      }
      dataMap.put(column, data)
    }

    var bigArray : List<Company> = {}
    for (name in dataMap.get("Company") index i) {
      var company = new Company()
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
    return bigArray
  }
}