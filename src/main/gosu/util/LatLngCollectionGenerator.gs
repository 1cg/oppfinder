package util

uses java.io.FileReader
uses java.io.BufferedReader
uses java.util.Map
uses model.DataSet
uses model.database.MongoCollection

class LatLngCollectionGenerator {

  // We stored the cities and coordinates in a file to work around the Google Geocoder request limit.
  static function writeLatLng() {
    var coordInput = new FileReader(AssetLibrarian.INSTANCE.LATLNG)
    var bufRead = new BufferedReader(coordInput)
    var myLine = bufRead.readLine()
    var dataStore = new MongoCollection (DataSet.REGION_COORDINATES)
    dataStore.drop()
    var locationMap : Map<String, String> = {}
    while (myLine != null) {
      var split = myLine.split(":")
      var city = split[0]
      var coords = split[1].substring(1)
      locationMap[city] = coords
      myLine = bufRead.readLine()
    }
    dataStore.insert(locationMap)
  }

}