package jobs

uses java.util.Map
uses model.MongoCollection
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses java.lang.Long
uses org.apache.mahout.cf.taste.impl.recommender.svd.SVDPlusPlusFactorizer
uses org.apache.mahout.cf.taste.impl.recommender.svd.SVDRecommender
uses util.MahoutUtil

class RecommendSubJob extends Job {

  var maxRecommendation : Float
  var minRecommendation : Float

  construct(data : Map<Object, Object> ) {
    super(data)
  }

  /*
  * Takes in the class name of the <<recommender.Field>> implementation that should be used
  * for analysis of the data set
  */
  construct(field : String, start : long, number : long, collection : String){
    super()
    this.FieldName = field
    this.Start = start
    this.Number = number
    this.Collection = collection
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

  property get Collection() : String {
    return search('DataSetCollection') as String
  }

  property set Collection(collection : String) {
    update({'DataSetCollection' -> collection})
  }

  override function executeJob() {
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    checkCancellation()
    var c = Class.forName(this.FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel(this.Collection)
    print(MahoutUtil.MODEL_MAP.Count)
    checkCancellation()
    var recommender = new SVDRecommender(model, new SVDPlusPlusFactorizer(model,10,10))
    var myRecommendations : List<Map<String,Float>> = {} // The recommended items for all users from this particular job
    var userIDs = model.getUserIDs()
    userIDs.skip(this.Start as int)
    var number = this.Number
    for (i in 0..|number) {
      if (i > 0 && i % 50 == 0) {
        Progress = Math.max(((i* 100)/number) as int, 1) //Reduce write load
        checkCancellation()
      }
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
      new MongoCollection (this.UUId).insert(myRecommendations)
    }
    field.releaseModel()
  }

  function normalize(value : Float) : Float {
    return (value - minRecommendation) / (maxRecommendation - minRecommendation)
  }

  override function doReset() {}

  override property set Status(status : String) {
    update({'Status' -> 'Subjob'})
  }

  override function renderToString() : String {
    return view.jobs.drilldowns.TestJob.renderToString()
  }

}