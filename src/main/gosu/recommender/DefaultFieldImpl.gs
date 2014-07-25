package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses util.MahoutUtil

class DefaultFieldImpl extends  AbstractField {

  construct(field : String) {
    _field = field
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return MahoutUtil.toDataModel(collection, _field, \ o -> o.toString().hashCode(), null)
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }

}