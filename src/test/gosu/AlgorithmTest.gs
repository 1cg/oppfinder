uses junit.framework.*
uses datagen.GenerateTest
uses jobs.GenerateJob
uses jobs.RecommendJob
uses java.lang.Thread
uses controller.JobController

class AlgorithmTest extends TestCase {

  public function testReaches() {


    new GenerateTest().generateTest('datagen/assets/dataReach.json', "Reach")
    var generateJob = new GenerateJob('datagen/assets/datareach.json')
    var gJobID = generateJob.UUId
    generateJob.start()
    while(jobs.Job.ActiveJobs.toList().map(\ j -> j.UUId).contains(gJobID)) {
      print(jobs.Job.getUUIDProgress(gJobID))
      print("waiting on generate...")
      Thread.sleep(1000)
    }

    var recommendJob = new RecommendJob()
    var rJobID = recommendJob.UUId
    recommendJob.start()
    while(jobs.Job.ActiveJobs.toList().map(\ j -> j.UUId).contains(rJobID)) {
      print("waiting on recommend...")
      Thread.sleep(1000)
    }

    var recommendations = recommendJob.ResultsData.find()
    print(recommendations.toString())
 //   assertTrue(topRecommendation.)

  }


}