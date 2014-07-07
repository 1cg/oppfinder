package util

uses java.text.SimpleDateFormat
uses java.lang.System

class TimeUtil {

  static final var sdf = new SimpleDateFormat("MMM d, 'at' h:mm a")

  static function now() : String {
    return sdf.format(System.currentTimeMillis())
  }

}