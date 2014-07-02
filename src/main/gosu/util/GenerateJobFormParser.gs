package util

uses java.util.UUID
uses datagen.GenerateRandom
uses jobs.GenerateJob
uses datagen.GenerateTest
uses java.net.URLDecoder

class GenerateJobFormParser {

  static function startJob(ds : String, type : String) : jobs.Job {
    ds = ds == null || ds == "" ? UUID.randomUUID().toString() : ds
    ds = URLDecoder.decode(ds, "UTC-8")
    if(type == "Reach") {
      new GenerateTest().generateTest('generateDataReach', 'Reach', 40000)
      return new GenerateJob('generateDataReach', ds).start()
    } else {
      new GenerateRandom().generateRandom('generateJobData')
      return new GenerateJob('generateJobData', ds).start()
    }
  }
}