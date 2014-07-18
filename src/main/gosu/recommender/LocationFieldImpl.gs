package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses util.MahoutUtil
uses model.database.MongoCollection
uses model.DataSet
uses com.google.code.geocoder.Geocoder
uses java.lang.Long

class LocationFieldImpl extends AbstractField {

  final static var geocoder = new Geocoder()
  final static var coordinates = new MongoCollection (DataSet.REGION_COORDINATES).find().iterator().next()

  construct() {
    _field = 'Region'
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return MahoutUtil.toDataModel(new MongoCollection (collection), _field,
        \ l -> locationToLat(l),\ l -> locationToLng(l))
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new EuclideanDistanceSimilarity(model)
  }

  function coords(location : String) : String {
    return coordinates[location] as String
  }

  function locationToLat(l : String) : long {
    return Long.parseLong(coords(l).split(",")[0])
  }

  function locationToLng(l : String) : long {
    return Long.parseLong(coords(l).split(", ")[1])
  }
}
