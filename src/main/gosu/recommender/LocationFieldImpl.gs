package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.ItemSimilarity
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses com.google.code.geocoder.Geocoder
uses java.lang.Long

class LocationFieldImpl implements Field {

  final static var geocoder = new Geocoder()
  final static var coordinates = new DataSet(DataSetEntry.REGIONCOORDINATES).find().toList()

  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), 'Region',
        \ l -> locationToLat(l),\ l -> locationToLng(l))
  }

  override function getSimilarity(model : DataModel): ItemSimilarity {
    return new EuclideanDistanceSimilarity(model)
  }

  function coords(location : String) : String {
    var city = coordinates.firstWhere(\ c -> c.containsValue(location))
    return city['Coords'] as String
  }

  function locationToLat(l : String) : long {
    return Long.parseLong(coords(l).split(",")[0])
  }

  function locationToLng(l : String) : long {
    return Long.parseLong(coords(l).split(", ")[1])
  }
}
