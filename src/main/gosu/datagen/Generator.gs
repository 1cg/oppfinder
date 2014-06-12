package datagen

uses java.io.FileReader
uses java.io.BufferedReader
uses java.util.HashMap
uses java.util.LinkedList
uses java.util.Random
uses model.Company
uses model.DataSet
uses java.math.BigDecimal
uses model.DataSetEntry
uses org.json.simple.JSONObject
uses org.json.simple.JSONArray
uses java.io.FileWriter
uses java.io.File

class Generator {
  static final var policies = {"Workers Comp", "Business Auto", "Property"}
  static final var columnMap = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt"
  }
  static final var dataMap = new HashMap<String, List>()
  static final var rand = new Random()

  static function generate() {
    for (column in columnMap.Keys) {
      var data = new LinkedList<String>()
      var input = new FileReader("datagen/"+columnMap.get(column))
      var bufRead = new BufferedReader(input)
      var myLine = bufRead.readLine()

      while (myLine != null) {
      data.add(myLine)
      myLine = bufRead.readLine()
      }

      dataMap.put(column, data)
    }

    // Replace or create new Mongo Collection loaded with this data
    var bigArray = new JSONArray()
    var outputFile = new FileWriter(new File("datagen/Output.json"))

    var dataSet = new DataSet(DataSetEntry.COLLECTION)
    dataSet.drop()

    for (name in dataMap.get("Company") index i) {
      var obj = new JSONObject()

      var company = new Company()
      company.CompanyName = dataMap.get("Company").get(i % dataMap.get("Company").size()) as String
      company.ContactName = dataMap.get("Contact Name").get(i % dataMap.get("Contact Name").size()) as String
      company.Email = dataMap.get("Email").get(i % dataMap.get("Email").size()) as String
      company.Region = dataMap.get("Region").get(i % dataMap.get("Region").size()) as String
      company.Size = (50 + rand.nextInt(6000)) as String

      obj.put("Company", dataMap.get("Company").get(i % dataMap.get("Company").size()) as String)
      obj.put("Contact Name", dataMap.get("Contact Name").get(i % dataMap.get("Contact Name").size()) as String)
      obj.put("Email", dataMap.get("Email").get(i % dataMap.get("Email").size()) as String)
      obj.put("Region", dataMap.get("Region").get(i % dataMap.get("Region").size()) as String)
      obj.put("Size", (50+rand.nextInt(40000)) as String)
      var coPoliciesJson = new JSONArray()
      var coPolicies = new HashMap<String, BigDecimal>();

      for (policyType in policies index j) {
        if (rand.nextInt(2) == 0 || j+1 == policies.size()) {
          var typePremiumJson = new JSONObject()
          typePremiumJson.put("type", policyType)
          typePremiumJson.put("premium", (5000 + rand.nextInt(999500)))
          coPoliciesJson.add(typePremiumJson)

          coPolicies.put(policies[rand.nextInt(policies.size())], new BigDecimal(5000+ rand.nextInt(999500)))
        } else {
          continue
        }

      }
      obj.put("policies", coPoliciesJson)

      bigArray.add(obj)
      var coPoliciesString = ""
      for (entry in coPolicies.entrySet()) {
        coPoliciesString += entry.toString()+"\n"
      }
      company.Policies = coPoliciesString
      company.save()
    }
    outputFile.write(bigArray.toJSONString())
    outputFile.flush()
    outputFile.close()

  }
}
