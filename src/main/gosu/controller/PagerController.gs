package controller

uses jobs.Job
uses model.Pager
uses java.util.Map

class PagerController {

  static function getPager(type : String, page : long) : Pager<Job> {
    var pager : Pager<Job>
    if (type == "complete") {
      pager = new Pager<Job>(Job.CompleteJobs,10)
    } else if (type == "running") {
      pager = new Pager<Job>(Job.ActiveJobs,10)
    } else {
      pager = new Pager<Job>(Job.CancelledJobs,10)
    }
    if (!pager.validPage(page)) {
      page = pager.lastPage()
    }
    pager.getPage(page)
    return pager
  }

  static function getCompanyPager(page : long) : Pager<Map<Object,Object>> {
    var pager : Pager<Map<Object,Object>>
    pager = new model.Pager<java.util.Map<Object,Object>>(model.DataSetEntry.All, 10)
    if (!pager.validPage(page)) {
      page = pager.lastPage()
    }
    pager.getPage(page)
    return pager
  }

  static function renderPager(type : String, page : long) : String {
    var pager = getPager(type,page)
    return view.PagerView.renderToString(type,page,pager)
  }
}