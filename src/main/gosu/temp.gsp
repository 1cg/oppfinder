uses controller.JobController
uses java.lang.Thread

var jc = new JobController()
jc.startGenerate()
while(jc.generateProgress(controller.JobController.LocalGenerateProgress) != "100%") {
  Thread.sleep(1000)
}
jc.startRecommend()