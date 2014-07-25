package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses util.MahoutUtil
uses com.google.code.geocoder.Geocoder
uses java.lang.Long
uses model.Coordinate
uses model.database.Document

class RegionFieldImpl extends AbstractField {

  final static var geocoder = new Geocoder()
  final static var coordinatesMap = Document.all(Coordinate.Collection).first()

  construct(field : String) {
    _field = field
  }

  override function getModel(collection : String): DataModel {
    _collection = collection
    return MahoutUtil.toDataModel(collection, _field,
        \ l -> locationToLat(l),\ l -> locationToLng(l))
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new EuclideanDistanceSimilarity(model)
  }

  function coordinates(location : String) : String {
    return coordinatesMap.get(location) as String
  }

  function locationToLat(l : String) : long {
    return Long.parseLong(coordinates(l).split(",")[0])
  }

  function locationToLng(l : String) : long {
    return Long.parseLong(coordinates(l).split(", ")[1])
  }
}
