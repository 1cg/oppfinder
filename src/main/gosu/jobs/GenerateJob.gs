package jobs

uses java.util.Map
uses java.io.FileReader
uses model.DataSet
uses model.DataSetEntry
uses org.json.simple.parser.JSONParser
uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses java.util.UUID
uses util.AssetLibrarian
uses java.io.BufferedReader

class GenerateJob extends Job {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct() {
    super()
  }

  construct(path: String) {
    super()
    update({'Path' -> path})
  }

  override function executeJob() {
    checkCancellation()
    var path = search('Path') as String
    var parser = new JSONParser()
    var dataSet = new DataSet(DataSetEntry.COLLECTION)
    dataSet.drop()
    var companies = (parser.parse(
        new FileReader(path)) as JSONArray)
        .map(\ o -> o as JSONObject)
    checkCancellation()
    for (company in companies index i) {
      if (i % 100 == 0) this.Progress = (i * 100) / companies.size()
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
    }
    checkCancellation()
    dataSet.insert(companies)
    writeLatLng()
  }

  override function reset() {}

  override function renderToString() : String {
    return view.GenerateJob.renderToString(this)
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