package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses util.Mahout
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity

class SizeFieldImpl extends AbstractField {

  construct(field : String) {
    _field = field
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return Mahout.toDataModel(collection, _field, \ o -> o.toLong(), null)
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }

}