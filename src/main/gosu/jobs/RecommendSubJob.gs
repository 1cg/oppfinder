package jobs

uses java.lang.Runnable
uses java.util.Map
uses model.DataSet
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender

class RecommendSubJob extends Job implements Runnable {

  var maxRecommendation : Float
  var minRecommendation : Float

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
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    if (this.Cancelled) return
    var c = Class.forName(this.FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel()
    var similarity = field.getSimilarity(model)
    //var neighborhood = new ThresholdUserNeighborhood(0.3, similarity, model)
    var recommender = new GenericItemBasedRecommender(model, similarity)
    //var recommender = new GenericUserBasedRecommender(model, neighborhood, similarity)
    var myRecommendations : List<Map<String,Float>> = {} // The recommended items for all users from this particular job
    for (user in model.getUserIDs()) {
      var recommendations = recommender.recommend(user, 3)
      for (recommendation in recommendations) {
        maxRecommendation = Math.max(recommendation.Value, maxRecommendation)
        minRecommendation = Math.min(recommendation.Value, minRecommendation)
        //Store the id in the table as well as the recommendation (a policy) and value
        myRecommendations.add({user.toString()+RecommendJob.DELIMITER+recommendation.ItemID -> recommendation.Value})
      }
    }
    myRecommendations = myRecommendations.map(\ m -> m.mapValues(\ v-> normalize(v)))
    new DataSet(this.UUId).insert(myRecommendations)
    this.Progress = 100
  }

  function normalize(value : Float) : Float {
    return (value - minRecommendation) / (maxRecommendation - minRecommendation)
  }


  override function reset() {}

  override property set Status(status : String) {
    update({'Status' -> 'Subjob'})
  }

  override function renderToString() : String {
    return view.TestJob.renderToString()
  }


}