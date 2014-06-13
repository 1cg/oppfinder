package jobs

uses java.lang.Runnable
uses java.util.Map
uses model.DataSet
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender
uses java.lang.System
uses java.lang.Long

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
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    if (this.Cancelled) return
    var c = Class.forName(this.FieldName)

    // TIME THE MODEL GENERATION
    var startTime = System.currentTimeMillis();
    var field = c.newInstance() as Field
    var model = field.getModel()
    var endTime = System.currentTimeMillis();
    print("MODEL TIMING: "+(endTime-startTime))

    startTime = System.currentTimeMillis()
    var similarity = field.getSimilarity(model)
    endTime = System.currentTimeMillis()
    print("SIMILARITY TIMING: "+(endTime - startTime))

    startTime = System.currentTimeMillis()
    //var neighborhood = new ThresholdUserNeighborhood(0.3, similarity, model)
    var recommender = new GenericItemBasedRecommender(model, similarity)
    endTime = System.currentTimeMillis()
    print("RECOMMENDER TIMING: "+(endTime - startTime))

    startTime = System.currentTimeMillis()
    //var recommender = new GenericUserBasedRecommender(model, neighborhood, similarity)


    /*
     * The following nested for loop needs to be parallelized.
     */
    var myRecommendations : List<Map<String,Float>> = {} // The recommended items for all users from this particular job

    var userIDs = model.getUserIDs()
    userIDs.skip(this.Start as int)
    for (i in 0..|this.Number) {
      if (!userIDs.hasNext()) {
        break
      }
      var user = userIDs.next()
      var recommendations = recommender.recommend(user, 3)
      for (recommendation in recommendations) {
        maxRecommendation = Math.max(recommendation.Value, maxRecommendation)
        minRecommendation = Math.min(recommendation.Value, minRecommendation)
        //Store the id in the table as well as the recommendation (a policy) and value
        myRecommendations.add({user.toString()+RecommendJob.DELIMITER+recommendation.ItemID -> recommendation.Value})
      }
    }
    endTime = System.currentTimeMillis()
    print("RECOMMENDATIONS TIMING: "+(endTime - startTime))
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