package model

uses util.SkipIterator

class Pager<T> {

  var pageSize : long
  var iterate : SkipIterator<T>
  var copy : SkipIterator<T>
  var jobs : List<T>
  var page : long as Current
  var processed : boolean

  construct(i : SkipIterator<T>, size : long) {
    iterate = i
    copy = i.copy()
    pageSize = size
    jobs = {}
  }

  function getPage(p : long) : List<T> {
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

  function validPage(p : long) : boolean {
    if (p < 1) return false
    var tmp = copy.copy()
    tmp.skip((p - 1) * pageSize)
    return tmp.hasNext()
  }

  function checkStatus(p : long) : String {
    if (p == page) {
      return "active"
    } else if (validPage(p)) {
      return ""
    }
    return "disabled"
  }

  function lastPage() : long {
    return iterate.Count / pageSize
  }

}