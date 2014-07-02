package util

uses java.io.File
uses org.apache.commons.io.FileUtils
uses java.util.Map

class AssetLibrarian {
  
  static final var _INSTANCE = new AssetLibrarian()
  static var _PATH : String

  var _POLICIES: List<String>  as readonly POLICIES
  var _REACHES: List<String> as readonly REACHES
  var _LATLNG: String as readonly LATLNG
  var _COLUMNMAP : Map<String, String> as readonly COLUMNMAP

  construct() {
    _PATH = 'src/main/resources/'
    _POLICIES = FileUtils.readLines(new File(getPath("PolicyTypes.txt")))
    _REACHES = FileUtils.readLines(new File(getPath("Reaches.txt")))
    _LATLNG = getPath("LatLng.txt")
    _COLUMNMAP = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt",
      "Policy" -> "PolicyTypes.txt",
      "Reach" -> "Reaches.txt"
    }

  }

  final function getPath(fileName : String) : String {
    return _PATH + fileName
  }

  static property get INSTANCE() : AssetLibrarian {
    return _INSTANCE
  }

}