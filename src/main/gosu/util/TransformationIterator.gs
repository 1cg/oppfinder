package util

uses java.util.Iterator
uses com.mongodb.DBCursor
uses java.util.Map

class TransformationIterator<T> implements Iterator<T>, SkipIterator<T> {

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

  override function skip(n: int) {
    cursor.skip(n)
  }

  override function copy(): SkipIterator<T> {
    return new TransformationIterator<T>(cursor.copy(), transformation)
  }
}