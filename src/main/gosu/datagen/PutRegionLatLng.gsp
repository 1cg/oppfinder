uses java.io.FileReader
uses java.io.BufferedReader
uses model.DataSet
uses model.DataSetEntry

// This is a temporary program.



var input = new FileReader("LatLng.txt")
var bufRead = new BufferedReader(input)
var myLine = bufRead.readLine()

while (myLine != null) {
  var split = myLine.split(":")
  var city = split[0]
  var coords = split[1].substring(1)

  var dataStore = new DataSet(DataSetEntry.REGIONCOORDINATES)

  dataStore.insert({city -> coords})


  myLine = bufRead.readLine()
}
