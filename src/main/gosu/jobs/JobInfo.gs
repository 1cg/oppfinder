package jobs

class JobInfo {

  var _UUID : String as UUID
  var _Progress : int as Progress

  construct(JobUUID : String, progress : int) {
    this.UUID = JobUUID
    this.Progress = progress
  }
}