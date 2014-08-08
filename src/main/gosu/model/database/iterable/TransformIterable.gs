package model.database.iterable

uses java.lang.Iterable
uses java.util.Iterator
uses com.mongodb.DBCursor

class TransformIterable <T> implements Iterable<T>, SkipIterable<T> {

  var _wrapped : DBCursor as Cursor
  var _transform : block(o:Object):T

  construct(wrapped: DBCursor, transform : block(o:Object):T) {
    _wrapped = wrapped
    _transform = transform
  }

  override function iterator(): Iterator<T> {
    return new TransformIterator<T>(_wrapped.iterator(), _transform)
  }

  override function skip(n: long) {
    if (n <= 0) return
    _wrapped = _wrapped.skip(n as int)
  }

  override property get Count(): long {
    return _wrapped.count()
  }

  override function paginate(page: String): PagerIterable<T> {
    var l = page == null ? 1 : page.toLong()
    return new PagerIterable<T>(this,l)
  }

  static class TransformIterator<TT> implements Iterator<TT> {

    var _iter : Iterator
    var _tr : block(o:Object):TT

    construct(i : Iterator, transform : block(o:Object):TT ) {
      _iter = i
      _tr = transform
    }

    override function hasNext(): boolean {
      return _iter.hasNext()
    }

    override function next(): TT {
      return _tr(_iter.next())
    }

    override function remove() {
      _iter.remove();
    }

  }

}