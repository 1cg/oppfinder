package jobs

uses java.util.Map
uses model.database.MongoCollection
uses java.lang.Class
uses recommender.Field
uses java.lang.Float
uses java.lang.Math
uses java.lang.Long
uses org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender
uses model.Result

class RecommendSubJob extends Job {

  var maxRecommendation : Float
  var minRecommendation : Float

  construct(key : String, value : Object) {
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
    save()
  }

  property get Start() : long {
    return get('Start') as Long
  }

  property set Start(start : long) {
    put('Start', start)
  }

  property get Number() : long {
    return get('Number') as Long
  }

  property set Number(start : long) {
    put('Number', start)
  }

  property get Collection() : String {
    return get('DataSetCollection') as String
  }

  property set Collection(collection : String) {
    put('DataSetCollection', collection)
  }

  override function executeJob() {
    maxRecommendation = Float.MIN_VALUE
    minRecommendation = Float.MAX_VALUE
    checkCancellation()
    var c = Class.forName(FieldName)
    var field = c.newInstance() as Field
    var model = field.getModel(Collection)
    checkCancellation()
    var recommender = new GenericItemBasedRecommender(model, field.getSimilarity(model))
    var userIDs = model.getUserIDs()
    userIDs.skip(Start as int)
    var number = this.Number
    var results : List<Result> = {}
    for (i in 0..|number) {
      if (i > 0 && i % 50 == 0) {
        Progress = Math.max(((i* 100)/number) as int, 1) //Reduce write load
        checkCancellation()
        save()
      }
      if (!userIDs.hasNext()) break
      var user = userIDs.next()
      var recommendations = recommender.recommend(user, 3)
      for (recommendation in recommendations) {
        maxRecommendation = Math.max(recommendation.Value, maxRecommendation)
        minRecommendation = Math.min(recommendation.Value, minRecommendation)
        //Store the id in the table as well as the recommendation (a policy) and value
        var result = new Result()
        result.User = user.toString()
        result.ItemID = recommendation.ItemID
        result.Value = recommendation.Value
        result.ResultSet = UUId
        results.add(result)
      }
    }
    results = results.map(\ r -> normalize(r))
    for (r in results) {
      r.save()
    }
    field.releaseModel()
  }

  function normalize(result : Result) : Result {
    result.Value = (result.Value - minRecommendation) / (maxRecommendation - minRecommendation)
    return result
  }

  override function doReset() {}

  override property set Status(status : String) {
    put('Status', 'Subjob')
  }

  override function renderToString() : String {
    return view.jobs.drilldowns.TestJob.renderToString()
  }

}