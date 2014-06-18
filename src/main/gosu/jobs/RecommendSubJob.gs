package jobs

uses java.lang.Runnable
uses java.util.Map
uses model.DataSet
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses java.lang.Long
uses org.apache.mahout.cf.taste.impl.recommender.svd.SVDPlusPlusFactorizer
uses org.apache.mahout.cf.taste.impl.recommender.svd.SVDRecommender

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
  * Takes in the class name of the <<recommender.Field>> implementation that should be used
  * for analysis of the data set
  */
  construct(field : String, start : long, number : long){
    super()
    this.FieldName = field
    this.Start = start
    this.Number = number
  }

  property get Start() : long {
    return search('Start') as Long
  }

  property set Start(start : long) {
    update({'Start' -> start})
  }

  property get Number() : long {
    return search('Number') as Long
  }

  property set Number(start : long) {
    update({'Number' -> start})
  }


  override function run() {
    try {
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    if (this.Cancelled) return
    var c = Class.forName(this.FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel()
    //var similarity = field.getSimilarity(model)
    //var recommender = new GenericItemBasedRecommender(model, similarity)
    var recommender = new SVDRecommender(model, new SVDPlusPlusFactorizer(model,10,10))
    var myRecommendations : List<Map<String,Float>> = {} // The recommended items for all users from this particular job
    var userIDs = model.getUserIDs()
    userIDs.skip(this.Start as int)
    for (i in 0..|this.Number) {
      Progress = ((i* 100)/Number) as int
      if (!userIDs.hasNext()) break
      var user = userIDs.next()
      var recommendations = recommender.recommend(user, 3)
      for (recommendation in recommendations) {
        maxRecommendation = Math.max(recommendation.Value, maxRecommendation)
        minRecommendation = Math.min(recommendation.Value, minRecommendation)
        //Store the id in the table as well as the recommendation (a policy) and value
        myRecommendations.add({user.toString()+RecommendJob.DELIMITER+recommendation.ItemID -> recommendation.Value})
      }
    }
    myRecommendations = myRecommendations.map(\ m -> m.mapValues(\ v-> normalize(v)))
    if (myRecommendations.size() > 0) {
      new DataSet(this.UUId).insert(myRecommendations)
    }
    this.Progress = 100
    print("Recommend subjob DONE")
    } catch(e) {
      e.printStackTrace()
      throw e
    }
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