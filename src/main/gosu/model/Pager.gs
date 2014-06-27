package model

uses util.SkipIterator
uses java.lang.Math

class Pager<T> {

  var pageSize : long
  var iterate : SkipIterator<T>
  var copy : SkipIterator<T>
  var jobs : List<T>
  var _page : long as Current
  var processed : boolean

  construct(i : SkipIterator<T>, size : long, page : long) {
    iterate = i
    copy = i?.copy()
    pageSize = size
    jobs = {}
    if (page < 1) {
      _page = 1
    }
    else {
      _page = (validPage(page)) ? page : lastPage()
    }
  }

  final property get Page() : List<T> {
    if (processed || _page == 0) return jobs
    iterate?.skip((_page -1) * pageSize)
    for (i in 0..|pageSize) {
      if (!iterate?.hasNext()) {
        break
      }
      jobs.add(iterate?.next())
    }
    processed = true
    return jobs
  }

  final function validPage(page : long) : boolean {
    if (page < 1) return false
    var tmp = copy?.copy()
    tmp?.skip((page - 1) * pageSize)
    return tmp?.hasNext()
  }

  final function checkStatus(page : long) : String {
    if (_page == page) {
      return "active"
    } else if (validPage(page)) {
      return ""
    }
    return "disabled"
  }

  final function lastPage() : long {
    return Math.max((iterate?.Count + pageSize - 1) / pageSize,1)
  }

}