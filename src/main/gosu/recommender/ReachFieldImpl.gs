package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses java.util.Map
uses java.lang.Integer
uses jobs.GenerateJob
uses datagen.assets.AssetLibrarian

class ReachFieldImpl implements Field {

  static final var reachMap = makeReachMap()

  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), "Reach",
       \ o -> reachToLong(o), null)
  }

  override function getSimilarity(model: DataModel): ItemSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }

  function reachToLong(reach : String) : long {
    return reachMap[reach]
  }

  static function makeReachMap() : Map<String, Integer> {
    var map : Map<String,Integer> = {}
    for (reach in AssetLibrarian.REACHES index i) {
      map[reach] = i
    }
    return map
  }
}