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

class RecommendSubJob extends Job implements Runnable {
  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  construct(fileLoc : String, userSimilarity : String){
    this.RecommendTaskFile = fileLoc
    this.RecommendTaskSimilarity = userSimilarity
  }

  override function run() {
    if (this.Cancelled) return

    var model = new FileDataModel(new File(this.RecommendTaskFile))
    var simType = this.RecommendTaskSimilarity

    var similarity : UserSimilarity

    // Doing the Class.forName() version of this was way too messy considering the model argument in the constructor
    // These 5 types of similarities seemed like the only ones we're interested in.
    if (simType == "PearsonCorrelationSimilarity") {
      similarity = new PearsonCorrelationSimilarity(model)
    } else if (simType == "SpearmanCorrelationSimilarity") { // like pearson but each user's preferences are sorted and then assign a rank as their preference value
      similarity = new SpearmanCorrelationSimilarity(model)
    } else if (simType == "LogLikelihoodSimilarity") {
      similarity = new LogLikelihoodSimilarity(model)
    } else if (simType == "EuclideanDistanceSimilarity") { // For comparison between locations (lat and long items)
      similarity = new EuclideanDistanceSimilarity(model)
    }

    var neighborhood = new ThresholdUserNeighborhood(0.3, similarity, model)
    var recommender = new GenericUserBasedRecommender(model, neighborhood, similarity)

    var myRecommendations = new DataSet(this.UUId) // The recommended items for all users from this particular job

    for (user in /* matt's Mahout Util to get all users */) {
      var recommendations = recommender.recommend(user.UUId, 3)
      myRecommendations.put(user.UUId, recommendations)

    }
    // For each UUID, store the intermediate results (which item # and their value) in the JOB UUID's own dataset

    this.Progress = 100
  }

  override function reset() {}

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }


}