package input_helper

uses java.util.Map
uses java.lang.IllegalAccessException
uses java.lang.NoSuchMethodException
uses com.google.gson.Gson

enhancement ObjectUpdaterEnhancement : java.lang.Object {

  function updateFrom(entries : Map<String, String>) {
    for (entry in entries.entrySet()) {
      var p = (typeof this).TypeInfo.getProperty(entry.Key)
      if (p == null) {
         throw new NoSuchMethodException()
      } else if (p.Writable) {
        this[entry.Key] = entry.Value
      } else {
        throw new IllegalAccessException()
      }
    }
  }

  function toJSON() : String {
    return new Gson().toJson(this)
  }

}
