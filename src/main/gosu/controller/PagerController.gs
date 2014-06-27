package controller

uses jobs.Job
uses model.Pager
uses java.util.Map
uses model.DataSetEntry

class PagerController {

  static function getPager(type : String, page : long) : Pager<Job> {
    if (type == "completed") {
      return new Pager<Job>(Job.CompleteJobs,10,page)
    } else if (type == "running") {
      return new Pager<Job>(Job.ActiveJobs,10,page)
    } else if (type == "failed") {
      return new Pager<Job>(Job.FailedJobs,10,page)
    } else if (type == "all") {
      return new Pager<Job>(Job.AllJobs,10,page)
    }  else {
      return new Pager<Job>(Job.CancelledJobs,10,page)
    }
  }

  static function getCompanyPager(page : long, collection : String = null) : Pager<Map<Object,Object>> {
    if (collection != null) {
      return new model.Pager<java.util.Map<Object,Object>>(DataSetEntry.All(collection), 10,page)
    } else {
      return new model.Pager<java.util.Map<Object,Object>>(DataSetEntry.MostRecentDataSet, 10,page)
    }
  }

  static function renderPager(type : String, pager : Pager) : String {
    return widgets.PagerWidget.renderWidget(pager, '/jobs?status=' + type + '&page=', type)
  }
}