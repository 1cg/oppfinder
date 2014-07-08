package jobs

uses java.util.Map
uses java.io.FileReader
uses java.io.BufferedReader
uses model.MongoCollection
uses model.DataSet
uses util.AssetLibrarian
uses java.util.UUID
uses datagen.GenerateTest
uses datagen.GenerateRandom

class GenerateJob extends Job {

  construct(data : Map<Object, Object>) {
    super(data)
  }

  construct(inputCollection: String, dataSet : String) {
    super()
    update({'JobType' -> inputCollection})
    update({'DataSetCollection' -> dataSet})
  }

  override function executeJob() {
    var data : List<Map<Object,Object>> = {}
    if(search('JobType') as String == 'Reach') {
      data = new GenerateTest().generateTest('Reach', 40000)
    } else {
      data = new GenerateRandom().generateRandom()
    }
    checkCancellation()
    this.StatusFeed = "Dropping previous dataset"
    checkCancellation()
    var companies : List<Map<Object,Object>> = {}
    this.StatusFeed = "Parsed company information"
    for (company in data index i) {
      if (i % 20 == 0) {
        this.Progress = (i * 100) / (data.Count)
        checkCancellation()
      }
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
      companies.add(company)
    }
    checkCancellation()
    var collection = search('DataSetCollection') as String
    var dataSet = new MongoCollection(collection)
    dataSet.drop()
    dataSet.insert(companies)
    new DataSet(collection)
    this.StatusFeed = "Company information inserted"
    //writeLatLng()
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