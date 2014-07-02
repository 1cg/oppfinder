package util

uses java.util.Iterator
uses java.lang.Iterable
uses java.lang.Math

class PagerIterable<T> implements Iterable<T> {

  var _wrapped : SkipIterable<T>
  var _page : long
  static final var PAGE_SIZE = 10

  construct(iter : SkipIterable<T>, page : long) {
    iter?.skip(page < 1 ? 0 : (page -1) * PAGE_SIZE)
    _wrapped = iter
    _page = validPage(page) ? page : Last
  }

  override function iterator() :  Iterator<T> {
    return new PagerIterator<T>(_wrapped?.iterator())
  }

  property get Last() : long {
    return Math.max((_wrapped?.Count + PAGE_SIZE - 1) / PAGE_SIZE,1)
  }

  final function validPage(page : long) : boolean {
    if (page < 1) return false
    return _wrapped?.Count > (page -1) * PAGE_SIZE
  }

  property get Current() : long {
    return _page
  }

  static class PagerIterator<TT> implements Iterator<TT> {

    var _iter : Iterator<TT>
    var _count : int

    construct(i : Iterator<TT>) {
      _iter = i
    }

    override function hasNext(): boolean {
      return _count < PAGE_SIZE && _iter?.hasNext()
    }

    override function next(): TT {
      _count ++
      return _iter?.next()
    }

    override function remove() {
      _iter?.remove();
    }
  }

}