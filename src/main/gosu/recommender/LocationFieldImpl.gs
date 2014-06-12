package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.*
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses com.google.code.geocoder.Geocoder
uses com.google.code.geocoder.GeocoderRequestBuilder

class LocationFieldImpl implements Field {

  final static var geocoder = new Geocoder()

  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), "Location",
        \ l -> locationToLat(l),\ l -> locationToLng(l) )
  }

  override function getSimilarity(model : DataModel): UserSimilarity {
    return new EuclideanDistanceSimilarity(model)
  }

  function locationToLat(l : String) : long {
    var geocoderRequest = new GeocoderRequestBuilder().setAddress("Paris, France").setLanguage("en").getGeocoderRequest();
    return geocoderRequest.Location.Lat.longValue()
  }

  function locationToLng(l : String) : long {
    var geocoderRequest = new GeocoderRequestBuilder().setAddress("Paris, France").setLanguage("en").getGeocoderRequest();
    return geocoderRequest.Location.Lng.longValue()
  }
}
