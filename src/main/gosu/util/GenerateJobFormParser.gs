package util

uses java.util.HashMap
uses java.util.Map
uses java.util.UUID
uses datagen.GenerateRandom
uses jobs.GenerateJob
uses datagen.GenerateTest

class GenerateJobFormParser {

  var formMap : Map<String, String>

  construct(form : String) {
    formMap = new HashMap<String, String>()

    for(kv in form.split(" *& *")) {
      var pairs = kv.split(" *= *", 2)
      formMap.put(pairs[0], pairs.length == 1 ? "" : pairs[1])
    }
  }


  function startJob() : jobs.Job {
    var name = formMap["dataSetName"]?.replaceAll("\\+", " ") ?: UUID.randomUUID().toString()
    if(formMap["generateStrategy"] == "Reach") {
      new GenerateTest().generateTest('dataReach.json', 'Reach', 40000)
      var job = new GenerateJob('dataReach.json', name).start()
      return job
    } else {
      new GenerateRandom().generateRandom('data.json')
      var job = new GenerateJob('data.json', name).start()
      return job
    }
  }
}