package util.iterable

uses java.lang.Iterable

interface SkipIterable <E> extends Iterable<E> {

  function skip(n : long)

  function copy() : SkipIterable<E>

  property get Count() : long

  function paginate(page : String) : PagerIterable<E>

}