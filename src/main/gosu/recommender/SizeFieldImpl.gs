package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses util.MahoutUtil
uses model.DataSet
uses org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity
uses model.DataSetEntry
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity

class SizeFieldImpl implements Field {
  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), "Size", \ o -> o.toLong(), null)
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new PearsonCorrelationSimilarity(model)
  }
}