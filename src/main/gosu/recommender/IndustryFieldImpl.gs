package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.UserSimilarity

class IndustryFieldImpl implements Field {
  override function getModel(): DataModel {
    return null
  }

  override function getSimilarity(model: DataModel): UserSimilarity {
    return null
  }
}