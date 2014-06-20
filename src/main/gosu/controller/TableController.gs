package controller

uses view.JobTable

class TableController {

  static function getRunningTable(page : long) : String {
    var pager = controller.PagerController.getPager("running",page)
    return JobTable.renderToString("Currently Running Jobs", "running", pager)
  }

  static function getCompleteTable(page : long) : String {
    var pager = controller.PagerController.getPager("complete",page)
    return JobTable.renderToString("Completed Jobs", "complete", pager)
  }

  static function getCancelledTable(page : long) : String {
    var pager = controller.PagerController.getPager("cancelled",page)
    return JobTable.renderToString("Cancelled Jobs", "cancelled", pager)
  }
}