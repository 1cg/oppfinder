package input_helper

uses java.util.Map
uses java.math.BigDecimal
uses java.util.ArrayList

class TagHelper {

  static var BOOLEAN_ATTRIBUTES = ("disabled readonly multiple checked autobuffer" +
  "autoplay controls loop selected hidden scoped async" +
  "defer reversed ismap seamless muted required" +
  "autofocus novalidate formnovalidate open pubdate" +
  "itemscope allowfullscreen default inert sortable" +
  "truespeed typemustmatch").split(" ")

  static function tag(name : String, options : Map<Object,Object> = null, open = false, escape = true) : String {
    return "<${name}${tagOptions(options)}${open ? '>' : '/>'}"
  }
  static function contentTag(name : String, content : String =  "", options : Map<Object,Object> = null, escape = true) : String {
    return "<${name}${options == null ? "" : tagOptions(options, escape)}>${content}</${name}>"
  }

  static function tagOptions(options : Map<Object, Object>, escape = true) : String {
    var attributes = {}
    if (options == null) return ""
    for (option in options.entrySet()) {
      if ((option.Key as String) == 'data' && option.Value typeis Map<Object,Object>) {
        for (data in (option.Value).entrySet()) {
          attributes.add(dataTagOptions(data.Key as String, data.Value))
        }
      } else if (BOOLEAN_ATTRIBUTES.contains(option.Key as String)) {
        attributes.add(booleanTagOption(option.Key as String))
      } else {
        attributes.add(tagOption(option.Key as String, option.Value))
      }
    }
    return ' ${attributes.join(" ")}'
  }

  static function dataTagOptions(key : String, value : Object) : String {
      key = "data-${key}"
      value = (value typeis String) || (value typeis BigDecimal) ? value : value.toJSON()
      return tagOption(key,value)
  }

  static function booleanTagOption(key : String) : String {
    return "${key}='${key}'"
  }

  static function tagOption(key : String, value : Object) : String {
    if (value typeis List<Object>) {
      value = (value as ArrayList<Object>).join(" ")
    }
    return "${key}='${value.toString()}'"
  }

}