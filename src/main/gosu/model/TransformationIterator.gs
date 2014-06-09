package model

uses java.util.Iterator

class TransformationIterator <Q, T> implements Iterator<T> {

  var iter : Iterator<Q>
  var transformation(elt: Q) : T

  construct(i : Iterator<Q>, t(elt : Q) : T) {
    this.iter = i
    this.transformation = t
  }

  override function hasNext(): boolean {
    return iter.hasNext()
  }

  override function next(): T {
    return transformation(iter.next())
  }

  override function remove() {
    iter.remove()
  }
}