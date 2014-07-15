uses java.io.FileReader
uses java.io.BufferedReader
uses com.google.code.geocoder.GeocoderRequestBuilder
uses com.google.code.geocoder.Geocoder
uses java.lang.Thread
uses model.DataSet
uses model.MongoCollection
uses java.util.Map
uses util.AssetLibrarian

/*
  This program is meant to be used once so we could work on the rest of the program without having to worry about
  Google Geocoder's limit of 10 requests per second and 2400 requests per day. This inserts the cities and coordinates
  into a mongo collection.
 */


var input = new FileReader(AssetLibrarian.INSTANCE.getPath("Cities.txt"))
var bufRead = new BufferedReader(input)
var myLine = bufRead.readLine()
var geocoder = new Geocoder()

var dataStore = new MongoCollection (DataSet.REGION_COORDINATES)
dataStore.drop()
var locationMap : Map<String, String> = {}
while (myLine != null) {
  var geocoderRequest = new GeocoderRequestBuilder().setAddress(myLine).setLanguage("en").getGeocoderRequest();
  var resultSLoc = geocoder.geocode(geocoderRequest).Results.get(0)
  var result = resultSLoc.Geometry.Location
  locationMap[resultSLoc.FormattedAddress.replaceAll('\\.','')] = result.Lat.longValue() + ", "+result.Lng.longValue()
  myLine = bufRead.readLine()
  Thread.sleep(150)
}
dataStore.insert(locationMap)
