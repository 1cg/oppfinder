uses java.io.FileReader
uses java.io.BufferedReader
uses com.google.code.geocoder.GeocoderRequestBuilder
uses com.google.code.geocoder.Geocoder
uses java.io.File
uses java.io.FileWriter
uses java.lang.Thread
uses model.DataSetEntry
uses model.DataSet

var input = new FileReader("Cities.txt")
var bufRead = new BufferedReader(input)
var myLine = bufRead.readLine()
var geocoder = new Geocoder()

var outputRough = new FileWriter(new File("LatLng.txt"))
var dataStore = new DataSet(DataSetEntry.REGIONCOORDINATES)
while (myLine != null) {
  print(myLine)
  var geocoderRequest = new GeocoderRequestBuilder().setAddress(myLine).setLanguage("en").getGeocoderRequest();
  var resultSLoc = geocoder.geocode(geocoderRequest).Results.get(0)
  var result = resultSLoc.Geometry.Location
  outputRough.write(resultSLoc.FormattedAddress + ": " + result.Lat.longValue() + ", "+result.Lng.longValue() + "\n")

  dataStore.insert({"City" -> resultSLoc.FormattedAddress, "Coords" -> result.Lat.longValue() + ", "+result.Lng.longValue()})

  myLine = bufRead.readLine()
  Thread.sleep(150)
}

outputRough.flush()
outputRough.close()
