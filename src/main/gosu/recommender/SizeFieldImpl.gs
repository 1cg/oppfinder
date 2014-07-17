package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses util.MahoutUtil
uses model.MongoCollection
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity

class SizeFieldImpl extends AbstractField {

  construct() {
    _field = 'Size'
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return MahoutUtil.toDataModel(new MongoCollection (collection), _field, \ o -> o.toLong(), null)
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }

}