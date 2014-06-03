package jobs

uses java.lang.Runnable
uses java.lang.Thread

class TestJob implements Runnable {
  override function run() {
    for(var i in 1..30) {
      print("Test Job On Iteration ${i}")
      Thread.sleep(1 * 1000)
    }
    print("Test Job Done!")
  }
}