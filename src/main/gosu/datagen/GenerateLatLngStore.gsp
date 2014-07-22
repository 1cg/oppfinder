uses java.io.FileReader
uses java.io.BufferedReader
uses com.google.code.geocoder.GeocoderRequestBuilder
uses com.google.code.geocoder.Geocoder
uses java.lang.Thread
uses util.AssetLibrarian
uses model.Coordinate

/*
  This program is meant to be used once so we could work on the rest of the program without having to worry about
  Google Geocoder's limit of 10 requests per second and 2400 requests per day. This inserts the cities and coordinates
  into a mongo collection.
 */


var reader = new BufferedReader(new FileReader(AssetLibrarian.INSTANCE.getPath("Cities.txt")))
var geocoder = new Geocoder()
var coordinate = new Coordinate()
for (line in reader.lines()) {
  var geocoderRequest = new GeocoderRequestBuilder().setAddress(line).setLanguage("en").getGeocoderRequest();
  var resultSLoc = geocoder.geocode(geocoderRequest).Results.get(0)
  var result = resultSLoc.Geometry.Location
  coordinate.put(resultSLoc.FormattedAddress.replaceAll('\\.',''),result.Lat.longValue() + ", "+result.Lng.longValue())
  Thread.sleep(150)
}
coordinate.save()
