package controller

uses view.JobTable

class TableController {

  static function getRunningTable(page : long) : String {
    return JobTable.renderToString("Currently Running Jobs", "running", page)
  }

  static function getCompleteTable(page : long) : String {
    return JobTable.renderToString("Completed Jobs", "complete", page)
  }

  static function getCancelledTable(page : long) : String {
    return JobTable.renderToString("Cancelled Jobs", "cancelled", page)
  }
}