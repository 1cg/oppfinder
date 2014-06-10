package model

uses java.util.Iterator
uses java.lang.Math

class Pager {

  static var PAGE_SIZE = 10
  var iterate : Iterator<jobs.Job>
  var jobs : List<jobs.Job>
  var cachedPage : int
  var currentPage : int as Current
  var end : boolean

  construct(i : Iterator<jobs.Job>) {
    iterate = i
    cachedPage = 0
    jobs = {}
  }

  function getPage(page : int) : List<jobs.Job> {
    if (validPage(page)) {
      this.currentPage = page
      return jobs.subList((page -1) * PAGE_SIZE, Math.min(page * PAGE_SIZE, jobs.size()))
    }
    return null
  }

  function validPage(page : int) : boolean {
    if (page <= 0) {
      return false
    } else if (fetchToPage(page)) {
      return true
    } else if ((page - 1) * PAGE_SIZE >= jobs.size() || jobs.size() == 0) {
      return false
    }
    return true
  }

  private function fetchToPage(newPage : int) : boolean {
    while (cachedPage < newPage) {
      for (i in 0..|PAGE_SIZE) {
        if (iterate.hasNext()) {
          jobs.add(iterate.next())
        } else {
          end = true
          return false
        }
      }
      cachedPage++
    }
    return true
  }

  function checkStatus(page : int) : String {
    if (page == currentPage) {
      return "active"
    } else if (!validPage(page)) {
      return "disabled"
    }
    return ""
  }

}