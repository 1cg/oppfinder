package util

interface SkipIterable <E> {

  function skip(n : long)

  function copy() : SkipIterable<E>

  //function page(page : int) : PagedData<E>

  property get Count() : long

}