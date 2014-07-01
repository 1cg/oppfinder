package util

uses java.lang.Iterable

interface SkipIterable <E> extends Iterable<E> {

  function skip(n : long)

  function copy() : SkipIterable<E>

  //function page(page : int) : PagedData<E>

  property get Count() : long

}