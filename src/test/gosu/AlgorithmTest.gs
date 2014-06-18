uses junit.framework.*
uses datagen.GenerateTest
uses jobs.GenerateJob
uses jobs.RecommendJob
uses java.lang.Thread
uses controller.JobController
uses jobs.TestJob

class AlgorithmTest extends TestCase {

  public function testReaches() {

    new GenerateTest().generateTest('src/main/gosu/datagen/assets/dataReach.json', "Reach")
    var generateJob = new GenerateJob('datagen/assets/dataReach.json')
    var gJobID = generateJob.UUId
    generateJob.start()
    while(jobs.Job.ActiveJobs.toList().map(\ j -> j.UUId).contains(gJobID)) {
      Thread.sleep(100)
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