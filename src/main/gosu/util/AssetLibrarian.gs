package util

uses java.io.File
uses org.apache.commons.io.FileUtils
uses java.util.Map
uses java.lang.ClassLoader

class AssetLibrarian {
  
  static final var _INSTANCE : AssetLibrarian = new AssetLibrarian()

  var _POLICIES: List<String>  as readonly POLICIES
  var _REACHES: List<String> as readonly REACHES
  var _LATLNG: String as readonly LATLNG
  var _COLUMNMAP : Map<String, String> as readonly COLUMNMAP
  var classLoader : ClassLoader
  
  construct() {
    classLoader = (typeof(this) as java.lang.Class).ClassLoader
    _POLICIES = FileUtils.readLines(new File(getPath("PolicyTypes.txt")))
    _REACHES = FileUtils.readLines(new File(getPath("Reaches.txt")))
    _LATLNG = classLoader.getResource("LatLng.txt").Path
    _COLUMNMAP = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt",
      "Policy" -> "PolicyTypes.txt",
      "Reach" -> "Reaches.txt"
    }

  }

  function getPath(fileName : String) : String {
    return classLoader.getResource(fileName).Path
  }

  static property get INSTANCE() : AssetLibrarian {
    return _INSTANCE
  }

}