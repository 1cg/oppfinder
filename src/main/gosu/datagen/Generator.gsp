uses java.io.FileWriter
uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses java.util.HashMap
uses java.util.LinkedList
uses java.util.Random

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

var allObjs = new JSONArray()


for (name in dataMap.get("Company") index i){
  var obj = new JSONObject()

  // new object

  for (column in columnMap.keySet()){
    obj.put(column, dataMap.get(column).get(i % dataMap.get(column).size()))
  }

  var coPolicies = new JSONArray();
  for (policyType in policies) {
    var typePremium = new JSONObject()
    typePremium.put("type", policyType)
    typePremium.put("premium", "$"+(5000 + rand.nextInt(999500)))

    coPolicies.add(typePremium)
  }

  obj.put("policies", coPolicies)
  allObjs.add(obj)
}
outputFile.write(allObjs.toJSONString())
outputFile.flush()
outputFile.close()