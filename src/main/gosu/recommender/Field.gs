package recommender

uses org.apache.mahout.cf.taste.similarity.UserSimilarity
uses org.apache.mahout.cf.taste.model.DataModel

interface Field {
  function getModel() : DataModel
  function getSimilarity(model : DataModel) : UserSimilarity
}