package controller

uses jobs.Job
uses model.Pager
uses java.util.Map
uses model.DataSetEntry

class PagerController {

  static function getPager(type : String, page : long) : Pager<Job> {
    var pager : Pager<Job>
    if (type == "complete") {
      pager = new Pager<Job>(Job.CompleteJobs,10,page)
    } else if (type == "running") {
      pager = new Pager<Job>(Job.ActiveJobs,10,page)
    } else if (type == "failed") {
      pager = new Pager<Job>(Job.FailedJobs,10,page)
    } else if (type == "all") {
      pager = new Pager<Job>(Job.AllJobs,10,page)
    }  else {
      pager = new Pager<Job>(Job.CancelledJobs,10,page)
    }
    return pager
  }

  static function getCompanyPager(page : long, collection : String = null) : Pager<Map<Object,Object>> {
    if (collection != null) {
      return new model.Pager<java.util.Map<Object,Object>>(DataSetEntry.All(collection), 10,page)
    } else {
      return new model.Pager<java.util.Map<Object,Object>>(DataSetEntry.MostRecentDataSet, 10,page)
    }
  }

  static function renderPager(type : String, page : long) : String {
    var pager = getPager(type,page)
    return widgets.PagerWidget.renderWidget(pager, '/jobs/' + type + '/', type)
  }
}