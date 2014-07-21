package util

uses java.io.FileReader
uses java.io.BufferedReader
uses model.Coordinate

class LatLngCollectionGenerator {

  // We stored the cities and coordinates in a file to work around the Google Geocoder request limit.
  static function writeLatLng() {
    var reader = new BufferedReader(new FileReader(AssetLibrarian.INSTANCE.LATLNG))
    var coordinate = new Coordinate()
    for (line in reader.lines().iterator()) {
      var split = line.split(":")
      var city = split[0]
      var coordinates = split[1].substring(1)
      coordinate.put(city, coordinates)
    }
    coordinate.save()
  }

}