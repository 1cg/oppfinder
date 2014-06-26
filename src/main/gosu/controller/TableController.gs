package controller

uses view.JobTable
uses view.JobTableBody

class TableController {

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