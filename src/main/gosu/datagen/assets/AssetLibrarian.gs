package datagen.assets

uses org.apache.commons.io.FileUtils
uses java.io.File
uses java.util.Map

class AssetLibrarian {
  public static final var POLICIES: List<String> = FileUtils.readLines(new File("PolicyTypes.txt"))
  public static final var REACHES: List<String> = FileUtils.readLines(new File("Reaches.txt"))

  public static final var COLUMNMAP: Map<String, String> = {
      "Company" -> "assets/Companies.txt",
      "Contact Name" -> "assets/Names.txt",
      "Email" -> "assets/Emails.txt",
      "Region" -> "assets/Regions.txt",
      "Policy" -> "assets/PolicyTypes.txt",
      "Reach" -> "assets/Reaches.txt"
  }
}