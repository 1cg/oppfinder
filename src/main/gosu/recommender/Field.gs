package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity

interface Field {
  function getModel() : DataModel
  function getSimilarity(model : DataModel) : ItemSimilarity
}