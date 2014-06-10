package model

uses java.util.Iterator
uses java.lang.Math

/*
* For most use cases, this will do a good job of paging the results and keeping *most* of the
* results out of memory. In the case where there are 1 million results and the user jumps to page
* 100k, this will blow up the memory. The assumption is that this won't happen.
 */
class Pager {

  var pageSize = 10
  var iterate : Iterator<jobs.Job>
  var jobs : List<jobs.Job>
  var cachedPage : int
  var currentPage : int as Current
  var end : boolean

  construct(i : Iterator<jobs.Job>, size : int) {
    iterate = i
    pageSize = size
    cachedPage = 0
    jobs = {}
  }

  function getPage(page : int) : List<jobs.Job> {
    if (validPage(page)) {
      this.currentPage = page
      return jobs.subList((page -1) * pageSize, Math.min(page * pageSize, jobs.size()))
    }
    return null
  }

  function validPage(page : int) : boolean {
    if (page <= 0) {
      return false
    } else if (fetchToPage(page)) {
      return true
    } else if ((page - 1) * pageSize >= jobs.size() || jobs.size() == 0) {
      return false
    }
    return true
  }

  private function fetchToPage(newPage : int) : boolean {
    while (cachedPage < newPage) {
      for (i in 0..|pageSize) {
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