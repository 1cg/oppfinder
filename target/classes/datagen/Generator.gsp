uses java.io.FileWriter
uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses java.util.HashMap
uses java.util.LinkedList
uses java.util.Random
uses model.Database
uses model.Company
uses java.math.BigDecimal

var file = new File("Output.json")
var outputFile = new FileWriter(file)

var policies = {"Workers Comp", "Business Auto", "Property"}
var columnMap = {
    "Company" -> "Companies.txt",
    "Name" -> "Names.txt",
    "Email" -> "Emails.txt",
    "Region" -> "Regions.txt"
    }
var dataMap = new HashMap<String, List>()
var rand = new Random()
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

var dataSet = new Database("mongodb").getDataSet("generatedCollection")
Company.deleteAllCompanies(dataSet)

for (name in dataMap.get("Company") index i) {
  var company = new Company(dataSet)
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