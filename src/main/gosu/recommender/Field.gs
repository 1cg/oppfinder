package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity

interface Field {
  function getModel(collection : String) : DataModel
  function getSimilarity(model : DataModel) : ItemSimilarity
  function releaseModel()
}