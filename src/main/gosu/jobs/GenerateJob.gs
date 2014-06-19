package jobs

uses java.lang.Runnable
uses java.util.Map
uses java.io.FileReader
uses java.io.BufferedReader
uses model.DataSet
uses model.DataSetEntry
uses org.json.simple.parser.JSONParser
uses org.json.simple.JSONArray
uses org.json.simple.JSONObject
uses java.io.File
uses util.AssetLibrarian
uses java.util.UUID

class GenerateJob extends Job implements Runnable {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct() {
    super()
  }

  construct(path : String) {
    super()
    update({'Path' -> path})
  }

  override function run() {
    if (Cancelled) return
    var path = search('Path') as String
    var parser = new JSONParser()
    var dataSet = new DataSet(DataSetEntry.COLLECTION)
    dataSet.drop()
    var companies = (parser.parse(
        new FileReader(path)) as JSONArray)
        .map(\ o -> o as JSONObject)
    for (company in companies) {
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
    }
    dataSet.insert(companies)
    writeLatLng()
    if (Cancelled) return
    this.Progress = 100
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
    while (myLine != null) {
      var split = myLine.split(":")
      var city = split[0]
      var coords = split[1].substring(1)
      dataStore.insert({"City" -> city, "Coords" -> coords})
      myLine = bufRead.readLine()
    }
  }

}