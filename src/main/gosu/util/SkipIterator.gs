package util

uses java.util.Iterator

interface SkipIterator <E> extends Iterator<E> {

  function skip(n : int)

  function copy() : SkipIterator<E>

}