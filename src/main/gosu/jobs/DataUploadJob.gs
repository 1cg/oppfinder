package jobs

uses model.DataSetInfo
uses java.util.UUID
uses datagen.GenerateTest
uses datagen.GenerateRandom
uses model.Company
uses model.database.Document
uses org.json.simple.parser.JSONParser
uses org.json.simple.JSONArray
uses java.util.Map
uses org.json.simple.JSONObject
uses java.util.Set
uses model.Policy

class DataUploadJob extends Job {

  enum Types {Test, Random}

  construct(key : String, value : Object) {
    super(key,value)
  }

  construct() {
    super()
  }

  property get DataSetCollection() : String {
    var ds = get('DataSetCollection') as String
    if (ds == null) { //If we weren't provided a collection, generate one
      ds = UUID.randomUUID().toString()
      DataSetCollection = ds
    }
    return ds
  }

  property set DataSetCollection(collection : String) {
    put('DataSetCollection', collection)
  }

  property get JobType() : Types {
    return Types.valueOf(get('JobType') as String)
  }

  property set JobType(type : Types) {
    put('JobType', type.toString())
  }

  property get Data() : String {
    return get('Data') as String
  }

  property set Data(data : String) {
    put('Data',data)
  }

  override function executeJob() {
    var data : List<Company> = {}
    if (JobType.Value == Types.Test) {
      data = GenerateTest.generateTest('Reach', 2)
    } else if (JobType.Value == Types.Random) {
      data = GenerateRandom.generateRandom()
    } else {
      data = parseUpload()
    }
    checkCancellation()
    var companies : List<Company> = {}
    this.StatusFeed = "Parsed company information"
    var policies : Set<Policy> = {}
    save()
    for (company in data index i) {
      if (i % 20 == 0) {
        this.Progress = (i * 100) / (data.Count)
        checkCancellation()
        save()
      }
      company.put('longID', UUID.randomUUID().LeastSignificantBits)
      company.DataSet = DataSetCollection
      company.save()
      policies.addAll(company.Policies)
    }
    checkCancellation()
    var size = Document.findMany(Company.ForeignName, DataSetCollection, Company.Collection).Count
    DataSetInfo.register(DataSetCollection, size, policies.toList(), data.first().AllFields)
    this.StatusFeed = "Company information inserted"
    this.StatusFeed = 'View data set <a href="/datasets/${DataSetCollection}">here</a>'
    this.StatusFeed = "Done"
  }

  override function doReset() {}

  override function renderToString() : String {
    return ""
  }

  function parseUpload() : List<Company> {
    var data = Data
    data = data.substring(0, data.lastIndexOf("\n---"))
    if (data.length < 6) {
      this.Progress = 100
      save()
      return null
    }
    var array = new JSONParser().parse(data) as JSONArray
    checkCancellation()
    var iterations = array.size()
    var companies : List<Company> = {}
    for (companyObject in array index i) {
      var company = new Company()
      company.putAll((companyObject as JSONObject) as Map<String, Object>)
      companies.add(company)
    }
    return companies
  }

}