package jobs

uses model.DataSet
uses java.util.UUID
uses datagen.GenerateTest
uses datagen.GenerateRandom
uses model.Company

class GenerateJob extends Job {

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

  override function executeJob() {
    var data : List<Company> = {}
    if (JobType.Value == Types.Test) {
      data = GenerateTest.generateTest(DataSetCollection,'Reach', 2)
    } else {
      data = GenerateRandom.generateRandom(DataSetCollection)
    }
    checkCancellation()
    this.StatusFeed = "Dropping previous dataset"
    checkCancellation()
    var companies : List<Company> = {}
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
      company.save()
    }
    checkCancellation()
    new DataSet(DataSetCollection) //TODO -- remove this magic shit
    this.StatusFeed = "Company information inserted"
    this.StatusFeed = 'View data set <a href="/datasets/${DataSetCollection}">here</a>'
    this.StatusFeed = "Done"
  }

  override function doReset() {}

  override function renderToString() : String {
    return ""
  }

}