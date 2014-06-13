package jobs

uses java.lang.Runnable
uses java.util.Map
uses org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood
uses model.DataSet
uses java.lang.Class
uses org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender
uses recommender.Field

class RecommendSubJob extends Job implements Runnable {
  construct(data : Map<Object, Object> ) {
    super(data)
  }

  construct() {
    super()
  }

  /*
  * Takes in the class name of the recommender.Field implementation that should be used
  * for analysis of the data set
  */
  construct(field : String){
    super()
    this.FieldName = field
  }

  override function run() {
    if (this.Cancelled) return
    var c = Class.forName(this.FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel()
    var similarity = field.getSimilarity(model)
    var neighborhood = new ThresholdUserNeighborhood(0.3, similarity, model)
    var recommender = new GenericUserBasedRecommender(model, neighborhood, similarity)
    var myRecommendations = new DataSet(this.UUId) // The recommended items for all users from this particular job
    for (user in model.getUserIDs()) {
      var recommendations = recommender.recommend(user, 3)
      for (recommendation in recommendations) {
        //Store the id in the table as well as the recommendation (a policy) and value
        myRecommendations.insert({user.toString()+","+recommendation.ItemID -> recommendation.Value})
      }
    }
    this.Progress = 100
  }

  override function reset() {}

  override property set Status(status : String) {
    update({'Status' -> 'Subjob'})
  }

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }


}