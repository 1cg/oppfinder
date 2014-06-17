package datagen.assets

uses org.apache.commons.io.FileUtils
uses java.io.File
uses java.util.Map

class AssetLibrarian {
   static final var _INSTANCE : AssetLibrarian = new AssetLibrarian()

  var _POLICIES: List<String>  as readonly POLICIES
  var _REACHES: List<String> as readonly REACHES

  var _COLUMNMAP : Map<String, String> as readonly COLUMNMAP

  property get INSTANCE() : AssetLibrarian {
    return _INSTANCE
  }

  construct() {
    var classLoader = (typeof(this) as java.lang.Class).ClassLoader
    var path = classLoader.getResource("PolicyTypes.txt").Path
    _POLICIES = FileUtils.readLines(new File(path))
    path = classLoader.getResource("Reaches.txt").Path
    _REACHES = FileUtils.readLines(new File(path))

    _COLUMNMAP = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt",
      "Policy" -> "PolicyTypes.txt",
      "Reach" -> "Reaches.txt"
    }

  }

}