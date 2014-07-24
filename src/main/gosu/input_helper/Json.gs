package input_helper

uses com.google.gson.Gson

class Json {

  static function fromJSON<T>(json : String, type : java.lang.reflect.Type) : T {
    return new Gson().fromJson(json, type)
  }

}