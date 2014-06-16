package util

uses java.util.Iterator

interface SkipIterator <E> extends Iterator<E> {

  function skip(n : long)

  function copy() : SkipIterator<E>

  property get Count() : long

}