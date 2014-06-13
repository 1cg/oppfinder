package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.UserSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses java.util.Map
uses java.lang.Integer
uses jobs.GenerateJob

class ReachFieldImpl implements Field {

  static final var policies = makeReachMap()

  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), "Reach",
       \ o -> reachToLong(o), null)
  }

  override function getSimilarity(model: DataModel): UserSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }

  function reachToLong(reach : String) : long {
    var reaches = {'Regional' -> 1,
                   'National' -> 2,
                   'Global' -> 3}
    return reaches[reach]
  }

  static function makeReachMap() : Map<String, Integer> {
    var reachMap : Map<String,Integer> = {}
    for (reach in GenerateJob.REACHES index i) {
      reachMap[reach] = i
    }
    return reachMap
  }
}