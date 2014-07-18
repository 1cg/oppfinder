package jobs

uses java.util.Map
uses model.MongoCollection
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses java.lang.Long
uses org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender

class RecommendSubJob extends Job {

  var maxRecommendation : Float
  var minRecommendation : Float

  construct(key : String, value : String) {
    super(key,value)
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
    return getField('Start') as Long
  }

  property set Start(start : long) {
    upsert('Start', start)
  }

  property get Number() : long {
    return getField('Number') as Long
  }

  property set Number(start : long) {
    upsert('Number', start)
  }

  property get Collection() : String {
    return getField('DataSetCollection') as String
  }

  property set Collection(collection : String) {
    upsert('DataSetCollection', collection)
  }

  override function executeJob() {
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    checkCancellation()
    var c = Class.forName(FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel(this.Collection)
    checkCancellation()
    var recommender = new GenericItemBasedRecommender(model, field.getSimilarity(model))
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
    upsert('Status', 'Subjob')
  }

  override function renderToString() : String {
    return view.jobs.drilldowns.TestJob.renderToString()
  }

}