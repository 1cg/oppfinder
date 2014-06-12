package recommender

uses org.apache.mahout.cf.taste.model.DataModel
uses org.apache.mahout.cf.taste.similarity.*
uses org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity
uses util.MahoutUtil
uses model.DataSet
uses model.DataSetEntry
uses com.google.code.geocoder.Geocoder
uses com.google.code.geocoder.GeocoderRequestBuilder
uses java.lang.Long

class LocationFieldImpl implements Field {

  final static var geocoder = new Geocoder()
  //final static var location = geocoder.geocode(new GeocoderRequestBuilder().setAddress("Paris, France").setLanguage("en").getGeocoderRequest()).Results.get(0).Geometry.Location

  override function getModel(): DataModel {
    return MahoutUtil.toDataModel(new DataSet(DataSetEntry.COLLECTION), "Region",
        \ l -> locationToLat(l),\ l -> locationToLng(l))
  }

  override function getSimilarity(model : DataModel): UserSimilarity {
    return new EuclideanDistanceSimilarity(model)
  }

  function coords(city : String) : String {
    return new DataSet(DataSetEntry.REGIONCOORDINATES).findOne({'City' -> city}).get("Coords") as String
  }

  function locationToLat(l : String) : long {
    //var geocoderRequest = new GeocoderRequestBuilder().setAddress("Paris, France").setLanguage("en").getGeocoderRequest()
    //return geocoder.geocode(geocoderRequest).Results.get(0).Geometry.Location.Lat.longValue()
    //return location.Lat.longValue()
    return Long.parseLong(coords(l).split(",")[0])
  }

  function locationToLng(l : String) : long {
    //var geocoderRequest = new GeocoderRequestBuilder().setAddress("Paris, France").setLanguage("en").getGeocoderRequest()
    //return geocoder.geocode(geocoderRequest).Results.get(0).Geometry.Location.Lng.longValue()
    //return location.Lng.longValue()
    return Long.parseLong(coords(l).split(", ")[1])
  }
}
