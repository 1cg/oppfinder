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

class GenerateJob extends Job implements Runnable {
  static final var policies = {"Workers Comp", "Business Auto", "Property"}
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
    if (IsCancelled) {
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
    if (IsCancelled) {
      return
    }
    var dataSet = new DataSet("oppFinder")
    dataSet.drop()
    for (name in dataMap.get("Company") index i) {
      var company = new Company("oppFinder")
      company.CompanyName = dataMap.get("Company").get(i % dataMap.get("Company").size()) as String
      company.ContactName = dataMap.get("Contact Name").get(i % dataMap.get("Contact Name").size()) as String
      company.Email = dataMap.get("Email").get(i % dataMap.get("Email").size()) as String
      company.Region = dataMap.get("Region").get(i % dataMap.get("Region").size()) as String

      var coPolicies = new HashMap<String, BigDecimal>();
      for (policyType in policies index j) {
        if (rand.nextInt(2) == 0 || j+1 == policies.size()) {
          coPolicies.put(policies[rand.nextInt(policies.size())], new BigDecimal(5000+ rand.nextInt(999500)))
        } else {
          continue
        }
      }
      var coPoliciesString = ""
      for (entry in coPolicies.entrySet()) {
        coPoliciesString += entry.toString()+"\n"
      }
      company.Policies = coPoliciesString
      company.save()
    }
    if (IsCancelled) {
      return
    }
    this.Progress = 100
  }

  override function renderToString() : String {
    return view.GenerateJob.renderToString(this)
  }

}