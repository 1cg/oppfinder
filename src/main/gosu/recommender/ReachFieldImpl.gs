package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses util.Mahout
uses java.util.Map
uses java.lang.Integer
uses util.AssetLibrarian
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity

class ReachFieldImpl extends AbstractField {

  static final var reachMap = makeReachMap()

  construct(field : String) {
    _field = field
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return Mahout.toDataModel(collection, _field,
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
    for (reach in AssetLibrarian.INSTANCE.REACHES index i) {
      map[reach] = i
    }
    return map
  }
}