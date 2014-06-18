uses junit.framework.*
uses datagen.GenerateTest
uses jobs.GenerateJob
uses jobs.RecommendJob
uses java.lang.Thread

class AlgorithmTest extends TestCase {

  public function testReaches() {

    new GenerateTest().generateTest('src/main/gosu/datagen/assets/dataReach.json', "Reach")
    var generateJob = new GenerateJob('datagen/assets/dataReach.json')
    var gJobID = generateJob.UUId
    generateJob.start()
    while(generateJob.Progress < 100) {
      Thread.sleep(100)
    }
    var recommendJob = new RecommendJob()
    var rJobID = recommendJob.UUId
    recommendJob.start()
    while(recommendJob.Progress < 100) {
      print("waiting on recommend...")
      Thread.sleep(100)
    }

    var recommendations = recommendJob.ResultsData.find()
    print(recommendations.toString())
 //   assertTrue(topRecommendation.)

  }


}