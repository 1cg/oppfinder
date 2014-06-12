uses java.io.FileReader
uses java.io.BufferedReader
uses com.google.code.geocoder.GeocoderRequestBuilder
uses com.google.code.geocoder.Geocoder
uses java.io.File
uses java.io.FileWriter
uses java.lang.Integer
uses java.math.BigDecimal
uses java.lang.Long
uses java.lang.Thread

var input = new FileReader("Cities.txt")
var bufRead = new BufferedReader(input)
var myLine = bufRead.readLine()
var geocoder = new Geocoder()

var outputRough = new FileWriter(new File("LatLng.txt"))

while (myLine != null) {
  print(myLine)
  var geocoderRequest = new GeocoderRequestBuilder().setAddress(myLine).setLanguage("en").getGeocoderRequest();
  var resultSLoc = geocoder.geocode(geocoderRequest).Results
  print(resultSLoc.toString())
  var result = resultSLoc.get(0).Geometry.Location
  outputRough.write(resultSLoc.get(0).FormattedAddress + ": " + result.Lat.longValue() + ", "+result.Lng.longValue() + "\n")
  myLine = bufRead.readLine()
  Thread.sleep(150)
}

outputRough.flush()
outputRough.close()
