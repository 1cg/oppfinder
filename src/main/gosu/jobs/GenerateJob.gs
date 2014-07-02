package jobs

uses java.util.Map
uses java.io.FileReader
uses java.io.BufferedReader
uses model.MongoCollection
uses model.DataSet
uses org.json.simple.parser.JSONParser
uses util.AssetLibrarian
uses java.util.UUID

class GenerateJob extends Job {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct(inputCollection: String, dataSet : String) {
    super()
    update({'Input' -> inputCollection})
    update({'DataSetCollection' -> dataSet})
  }

  override function executeJob() {
    checkCancellation()
    var parser = new JSONParser()
    this.StatusFeed = "Dropping previous dataset"
    var dataSet = new MongoCollection(search('DataSetCollection') as String)
    dataSet.drop()
    var companiesDS = new MongoCollection(search('Input') as String)
    checkCancellation()
    var companies : List<Map<Object,Object>> = {}
    this.StatusFeed = "Parsed company information"
    for (company in companiesDS.find() index i) {
      //Thread.sleep(10)
      if (i % 20 == 0) {
        this.Progress = (i * 100) / (companiesDS.Count as int)
        checkCancellation()
      }
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
      companies.add(company)
    }
    checkCancellation()
    dataSet.insert(companies)
    companiesDS.drop()
    this.StatusFeed = "Company information inserted"
    writeLatLng()
    this.StatusFeed = "Done"
  }

  override function doReset() {}

  override function renderToString() : String {
    return ""
  }

  // We stored the cities and coordinates in a file to work around the Google Geocoder request limit.
  function writeLatLng() {
    var coordInput = new FileReader(AssetLibrarian.INSTANCE.LATLNG)
    var bufRead = new BufferedReader(coordInput)
    var myLine = bufRead.readLine()
    var dataStore = new MongoCollection (DataSet.REGIONCOORDINATES)
    dataStore.drop()
    var locationMap : Map<String, String> = {}
    while (myLine != null) {
      var split = myLine.split(":")
      var city = split[0]
      var coords = split[1].substring(1)
      locationMap[city] = coords
      myLine = bufRead.readLine()
    }
    dataStore.insert(locationMap)
  }

}