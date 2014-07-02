package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses util.MahoutUtil
uses model.MongoCollection
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.LogLikelihoodSimilarity

class SizeFieldImpl implements Field {
  override function getModel(collection : String): DataModel {
    return MahoutUtil.toDataModel(new MongoCollection (collection), "Size", \ o -> o.toLong(), null)
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new LogLikelihoodSimilarity(model)
  }

}