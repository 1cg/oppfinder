package util

uses java.util.Iterator
uses com.mongodb.DBCursor
uses java.util.Map

class TransformationIterator<T> implements Iterator<T>, SkipIterable<T> {

  var cursor : DBCursor
  var transformation(elt: Map) : T

  construct(c : DBCursor, f(elt : Map) : T) {
    this.cursor = c
    this.transformation = f
  }

  construct(t : TransformationIterator, f(elt : Map) : T) {
    this.cursor = t.cursor
    this.transformation = f
  }

  override function hasNext(): boolean {
    return cursor.hasNext()
  }

  override function next(): T {
    return transformation(cursor.next().toMap())
  }

  override function remove() {
    cursor.remove()
  }

  override function skip(n: long) {
    cursor.skip(n as int)
  }

  override function copy(): SkipIterable<T> {
    return new TransformationIterator<T>(cursor.copy(), transformation)
  }

  override property get Count(): long {
    return cursor.count()
  }

  /*override function page(page: int): PagedData<T> {
    return new PagedData<T>(page, cursor.skip(page < 1 ? 0 : (page -1) * PagedData.PAGE_SIZE).iterator())
  }
*/
}