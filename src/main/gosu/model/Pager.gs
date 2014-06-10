package model

uses util.SkipIterator

/*
* For most use cases, this will do a good job of paging the results and keeping *most* of the
* results out of memory. In the case where there are 1 million results and the user jumps to page
* 100k, this will blow up the memory. The assumption is that this won't happen.
 */
class Pager {

  var pageSize : int
  var iterate : SkipIterator<jobs.Job>
  var copy : SkipIterator<jobs.Job>
  var jobs : List<jobs.Job>
  var page : int as Current
  var processed : boolean

  construct(i : SkipIterator<jobs.Job>, size : int) {
    iterate = i
    copy = i.copy()
    pageSize = size
    jobs = {}
  }

  function getPage(p : int) : List<jobs.Job> {
    if (processed || p < 1) return jobs
    iterate.skip((p -1) * pageSize)
    for (i in 0..|pageSize) {
      if (!iterate.hasNext()) {
        break
      }
      jobs.add(iterate.next())
    }
    this.page = p
    processed = true
    return jobs
  }

  function validPage(p : int) : boolean {
    if (p < 1) return false
    var tmp = copy.copy()
    tmp.skip((p - 1) * pageSize)
    return tmp.hasNext()
  }

  function checkStatus(p : int) : String {
    if (p == page) {
      return "active"
    } else if (validPage(p)) {
      return ""
    }
    return "disabled"
  }

}