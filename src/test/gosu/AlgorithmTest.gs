uses junit.framework.*
uses datagen.GenerateTest
uses jobs.GenerateJob
uses jobs.RecommendJob
uses java.lang.Thread

class AlgorithmTest extends TestCase {
  static final var numCompanies = 1000

  public function testReaches() {
  for (1..80 index i) {
    print("iteration: "+i)
    new GenerateTest().generateTest('src/main/gosu/datagen/assets/dataReach.json', "Reach", numCompanies)
    var generateJob = new GenerateJob('src/main/gosu/datagen/assets/dataReach.json')
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

    var recommendations = recommendJob.ResultsData.find().next()
    print(recommendations)
 //   assertTrue(topRecommendation.)

  }


}