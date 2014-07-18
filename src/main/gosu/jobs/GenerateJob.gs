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

  enum Types {Test, Random}

  construct(key : String, value : String) {
    super(key,value)
  }

  construct() {
    super()
  }

  property get DataSetCollection() : String {
    var ds = getField('DataSetCollection') as String
    if (ds == null) { //If we weren't provided a collection, generate one
      ds = UUID.randomUUID().toString()
      DataSetCollection = ds
    }
    return ds
  }

  property set DataSetCollection(collection : String) {
    upsert('DataSetCollection', collection)
  }

  property get JobType() : Types {
    return Types.valueOf(getField('JobType') as String)
  }

  property set JobType(type : Types) {
    upsert('JobType', type.toString())
  }

  override function executeJob() {
    var data : List<Map<String,Object>> = {}
    if (JobType.Value == Types.Test) {
      data = new GenerateTest().generateTest('Reach', 2)
    } else {
      data = new GenerateRandom().generateRandom()
    }
    checkCancellation()
    this.StatusFeed = "Dropping previous dataset"
    checkCancellation()
    var companies : List<Map<String,Object>> = {}
    this.StatusFeed = "Parsed company information"
    save()
    for (company in data index i) {
      if (i % 20 == 0) {
        this.Progress = (i * 100) / (data.Count)
        checkCancellation()
        save()
      }
      var uuid = UUID.randomUUID()
      company.put('UUId', uuid.toString())
      company.put('longID', uuid.LeastSignificantBits)
      companies.add(company)
    }
    checkCancellation()
    var collection = DataSetCollection
    var dataSet = new MongoCollection(collection)
    dataSet.drop()
    dataSet.insert(companies)
    new DataSet(collection)
    this.StatusFeed = "Company information inserted"
    this.StatusFeed = 'View data set <a href="/datasets/${collection}">here</a>'
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
    var dataStore = new MongoCollection (DataSet.REGION_COORDINATES)
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