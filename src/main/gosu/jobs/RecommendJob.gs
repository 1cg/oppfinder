package jobs

uses java.lang.Runnable
uses java.util.Map
uses model.DataSet
uses org.apache.mahout.cf.taste.impl.model.file.FileDataModel
uses org.apache.mahout.cf.taste.model.DataModel
uses java.io.File
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood

class RecommendJob extends Job implements Runnable {
  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  override function run() {
    if (this.Cancelled) return

    // DURING MERGE, DON'T TAKE THIS VERSION :)

    var model = new FileDataModel(new File("recommender/dataset.csv"))
    var similarity = new PearsonCorrelationSimilarity(model) // Replace this with appropriate models for each job
    var neighborhood = new ThresholdUserNeighborhood(0.1, similarity, model)
    var


    this.Progress = 100
  }

  override function reset() {}

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }

}