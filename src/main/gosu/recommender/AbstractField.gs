package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses util.MahoutUtil

abstract class AbstractField implements Field {

  protected var _collection : String
  protected var _field : String

  abstract override function getModel(collection: String): DataModel

  abstract override function getSimilarity(model: DataModel): ItemSimilarity

  override final function releaseModel() {
    MahoutUtil.releaseDataModel(_field, _collection)
  }
}