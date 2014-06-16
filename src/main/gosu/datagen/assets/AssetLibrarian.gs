package datagen.assets

uses org.apache.commons.io.FileUtils
uses java.io.File
uses java.util.Map

class AssetLibrarian {
  public static var POLICIES: List<String> = FileUtils.readLines(new File("src/main/gosu/datagen/assets/PolicyTypes.txt"))
  public static var REACHES: List<String> = FileUtils.readLines(new File("src/main/gosu/datagen/assets/Reaches.txt"))

  public static var COLUMNMAP : Map<String, String> = {
      "Company" -> "Companies.txt",
      "Contact Name" -> "Names.txt",
      "Email" -> "Emails.txt",
      "Region" -> "Regions.txt",
      "Policy" -> "PolicyTypes.txt",
      "Reach" -> "Reaches.txt"
  }

}