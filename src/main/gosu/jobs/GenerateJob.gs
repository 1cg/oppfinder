package jobs

uses java.util.Map
uses java.io.FileReader
uses java.io.BufferedReader
uses model.DataSet
uses model.DataSetEntry
uses org.json.simple.parser.JSONParser
uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses util.AssetLibrarian
uses java.util.UUID
uses java.lang.Thread

class GenerateJob extends Job {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct() {
    super()
  }

  /*
  construct(path: String) {
    super()
    update({'Path' -> path})
  }
*/
  construct(path: String, dataSet : String) {
    super()
    update({'DataSetCollection' -> dataSet})
    update({'Path' -> path})
  }

  override function executeJob() {
    checkCancellation()
    var path = search('Path') as String
    var collection = search('DataSetCollection') as String
    var parser = new JSONParser()
    this.StatusFeed = "Dropping previous dataset"
    var dataSet = new DataSet(collection)
    dataSet.drop()
    var companies = (parser.parse(
        new FileReader(AssetLibrarian.INSTANCE.getPath(path))) as JSONArray)
        .map(\ o -> o as JSONObject)
    checkCancellation()
    this.StatusFeed = "Parsed company information"
    for (company in companies index i) {
      //Thread.sleep(10)
      if (i % 20 == 0) this.Progress = (i * 100) / companies.size()
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
    }
    checkCancellation()
    dataSet.insert(companies)
    this.StatusFeed = "Company information inserted"
    writeLatLng()
    this.StatusFeed = "Done"
  }

  override function reset() {}

  override function renderToString() : String {
    return ""
  }

  // We stored the cities and coordinates in a file to work around the Google Geocoder request limit.
  function writeLatLng() {
    var coordInput = new FileReader(AssetLibrarian.INSTANCE.LATLNG)
    var bufRead = new BufferedReader(coordInput)
    var myLine = bufRead.readLine()
    var dataStore = new DataSet(DataSetEntry.REGIONCOORDINATES)
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