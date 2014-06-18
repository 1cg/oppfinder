uses junit.framework.*
uses datagen.GenerateTest
uses jobs.GenerateJob
uses jobs.RecommendJob

class AlgorithmTest extends TestCase {

  public function testReaches() {

    new GenerateTest().generateTest('src/main/gosu/datagen/assets/dataReach.json', "Reach")
    new GenerateJob('datagen/assets/dataReach.json').start().join()
    var recommendJob = new RecommendJob()
    recommendJob.start().join()

    var recommendations = recommendJob.ResultsData.find()
    print(recommendations.toString())
  }


}