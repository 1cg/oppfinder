package jobs

uses java.lang.Runnable
uses java.util.Map
uses org.apache.mahout.cf.taste.impl.model.file.FileDataModel
uses java.io.File
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood
uses model.DataSet
uses org.apache.mahout.cf.taste.similarity.UserSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.CityBlockSimilarity
uses java.lang.Class
uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.impl.similarity.SpearmanCorrelationSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.LogLikelihoodSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender
uses util.MahoutUtil
uses recommender.Field

class RecommendSubJob extends Job implements Runnable {
  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  construct(field : String){
    this.RecommendTaskField = field
  }

  override function run() {
    if (this.Cancelled) return

    var c = Class.forName(this.RecommendTaskField)
    var field = c.newInstance() as Field

    var model = field.getModel()
    var similarity = field.getSimilarity(model)

    var neighborhood = new ThresholdUserNeighborhood(0.3, similarity, model)
    var recommender = new GenericUserBasedRecommender(model, neighborhood, similarity)

    var myRecommendations = new DataSet(this.UUId) // The recommended items for all users from this particular job


    for (user in model.getUserIDs()) {
      var recommendations = recommender.recommend(user, 3)
      myRecommendations.insert({user.toString() -> recommendations.toString()})

    }
    // For each UUID, store the intermediate results (which item # and their value) in the JOB UUID's own dataset

    this.Progress = 100
  }

  override function reset() {}

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }


}