package controller

uses view.JobTable
uses view.JobTableBody

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

  static function getFailedTable(page : long) : String {
    var pager = controller.PagerController.getPager("failed",page)
    return JobTable.renderToString("Failed Jobs", "failed", pager)
  }

  static function getAllTable(page : long) : String {
    var pager = controller.PagerController.getPager("all",page)
    return JobTable.renderToString("All Jobs", "all", pager)
  }

  static function getAllTableBody(page : long) : String {
    var pager = controller.PagerController.getPager("all",page)
    return JobTableBody.renderToString("all", pager)
  }

  static function getCompleteTableBody(page : long) : String {
    var pager = controller.PagerController.getPager("complete",page)
    return JobTableBody.renderToString("complete", pager)
  }

  static function getCancelledTableBody(page : long) : String {
    var pager = controller.PagerController.getPager("cancelled",page)
    return JobTableBody.renderToString("cancelled", pager)
  }

  static function getRunningTableBody(page : long) : String {
    var pager = controller.PagerController.getPager("running",page)
    return JobTableBody.renderToString("running", pager)
  }

  static function getFailedTableBody(page : long) : String {
    var pager = controller.PagerController.getPager("failed",page)
    return JobTableBody.renderToString("failed", pager)
  }



}