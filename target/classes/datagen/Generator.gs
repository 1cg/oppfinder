package datagen

uses java.io.FileReader
uses java.io.BufferedReader
uses java.util.HashMap
uses java.util.LinkedList
uses java.util.Random
uses model.Company
uses model.DataSet
uses java.math.BigDecimal

class Generator {
  static final var policies = {"Workers Comp", "Business Auto", "Property"}
  static final var columnMap = {
      "Company" -> "Companies.txt",
      "Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt"
  }
  static final var dataMap = new HashMap<String, List>()
  static final var rand = new Random()

  static function generate() {
    for (column in columnMap.Keys) {
    var data = new LinkedList<String>()
    var input = new FileReader(columnMap.get(column))
    var bufRead = new BufferedReader(input)
    var myLine = bufRead.readLine()

    while (myLine != null) {
    data.add(myLine)
    myLine = bufRead.readLine()
    }

    dataMap.put(column, data)
    }

    // Replace or create new Mongo Collection loaded with this data

    var dataSet = new DataSet("Randomly Generated Data")
    dataSet.drop()

    for (name in dataMap.get("Company") index i) {
    var company = new Company("Ramdomly Generated Data")
    company.CompanyName = dataMap.get("Company").get(i % dataMap.get("Company").size()) as String
    company.ContactName = dataMap.get("Name").get(i % dataMap.get("Name").size()) as String
    company.Email = dataMap.get("Email").get(i % dataMap.get("Email").size()) as String
    company.Region = dataMap.get("Region").get(i % dataMap.get("Region").size()) as String

    var coPolicies = new HashMap<String, BigDecimal>();

    for (policyType in policies) {
    if (rand.nextInt(2) == 0) {
    continue
    }
    coPolicies.put(policyType, new BigDecimal(5000 + rand.nextInt(999500)))
    }

    company.save()

    }

    print(dataSet.Count)
  }
}