package controller

uses jobs.Job
uses model.Pager

class PagerController {
  static function getPager(type : String) : Pager<Job> {
    if (type == "complete") {
      return new Pager<Job>(Job.CompleteJobs,10)
    } else if (type == "running") {
      return new Pager<Job>(Job.ActiveJobs,10)
    } else {
      return new Pager<Job>(Job.CancelledJobs,10)
    }
  }
}