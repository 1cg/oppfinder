package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.UserSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity

class ReachFieldImpl implements Field {
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
}