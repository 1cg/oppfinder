package jobs

uses java.lang.Runnable
uses java.util.Map
uses java.util.HashMap
uses java.util.Random
uses java.util.LinkedList
uses java.io.FileReader
uses java.io.BufferedReader
uses model.DataSet
uses model.Company
uses java.math.BigDecimal
uses model.DataSetEntry

class GenerateJob extends Job implements Runnable {
  public static final var POLICIES: List<String> = {"Workers Comp", "Business Auto", "Property", "Earthquake", "Tsunami", "Godzilla"}
  public static final var DELIMITER : String = ","
  static final var columnMap = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt"
  }
  static final var dataMap = new HashMap<String, List>()
  static final var rand = new Random()

  construct() {
    super()
  }
  construct(data : Map<Object, Object>) {
    super(data)
  }

  override function run() {
    if (Cancelled) {
      return
    }
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
    this.Progress = 50
    if (Cancelled) {
      return
    }
    var dataSet = new DataSet(DataSetEntry.COLLECTION)
    dataSet.drop()

    for (name in dataMap.get("Company") index i) {
      var company = new Company()
      company.CompanyName = dataMap.get("Company").get(i % dataMap.get("Company").size()) as String
      company.ContactName = dataMap.get("Contact Name").get(i % dataMap.get("Contact Name").size()) as String
      company.Email = dataMap.get("Email").get(i % dataMap.get("Email").size()) as String
      company.Region = dataMap.get("Region").get(rand.nextInt(dataMap.get("Region").size())) as String
      company.Size = (50 + rand.nextInt(40000)) as String
      var coPolicies = new HashMap<String, BigDecimal>();
      for (policyType in POLICIES index j) {
        if (rand.nextInt(2) == 0 || j+1 == POLICIES.size()) {
          coPolicies.put(POLICIES[rand.nextInt(POLICIES.size())], new BigDecimal(5000+ rand.nextInt(999500)))
        } else {
          continue
        }
      }
      var coPoliciesString = ""
      for (entry in coPolicies.entrySet() index k) {
        if (k == coPolicies.entrySet().size()-1) {
          coPoliciesString += entry.toString()
        } else {
        coPoliciesString += entry.toString()+DELIMITER
          }
      }
      company.Policies = coPoliciesString
      company.save()
    }

    var coordInput = new FileReader("datagen/LatLng.txt")
    var bufRead = new BufferedReader(coordInput)
    var myLine = bufRead.readLine()
    var dataStore = new DataSet(DataSetEntry.REGIONCOORDINATES)
    dataStore.drop()
    while (myLine != null) {
      var split = myLine.split(":")
      var city = split[0]
      var coords = split[1].substring(1)
      dataStore.insert({"City" -> city, "Coords" -> coords})
      myLine = bufRead.readLine()
    }

    if (Cancelled) {
      return
    }
    this.Progress = 100
  }

  override function reset() {}

  override function renderToString() : String {
    return view.GenerateJob.renderToString(this)
  }

}