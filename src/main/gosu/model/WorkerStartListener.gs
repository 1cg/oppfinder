package model

uses net.greghaines.jesque.worker.WorkerListener
uses java.lang.Exception
uses net.greghaines.jesque.worker.WorkerEvent
uses net.greghaines.jesque.Job
uses net.greghaines.jesque.worker.Worker
uses java.lang.Override

class WorkerStartListener implements WorkerListener{
  @Override
  function onEvent(event : WorkerEvent, worker : Worker, queue : String, job : Job, runner : Object, result : Object, ex : Exception) {
  }
}