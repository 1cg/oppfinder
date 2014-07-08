package util

uses java.util.UUID
uses jobs.GenerateJob
uses java.net.URLDecoder

class GenerateJobFormParser {

  static function startJob(ds : String, type : String) : jobs.Job {
    ds = ds == null || ds == "" ? UUID.randomUUID().toString() : ds
    ds = URLDecoder.decode(ds, "UTF-8")
    return new GenerateJob(type, ds).start()
  }
}