package input_helper

uses gw.lang.reflect.features.PropertyReference
uses java.lang.Iterable
uses java.lang.StringBuffer
uses java.util.Map
uses java.lang.IllegalArgumentException
uses gw.lang.reflect.IEnumType

class InputGenerator {

  static function textInput(literal: PropertyReference, name: String = null, options: Map<String, String> = null) : String {
    var label =  labelInput(name, literal)
    return label + TagHelper.tag('input', {'name' -> format(literal),
                                           'type' -> 'text'}.merge(options))
  }

  static function radioInput(literal: PropertyReference, name: String = null, options: Map<String, String> = null) : String {
    var buf = new StringBuffer()
    buf.append(labelInput(name, literal))
    for (value in getValues(literal)) {
      var tag = (TagHelper.tag('input', {'value' -> value as String,
                                          'type' -> 'radio',
                                          'name' -> format(literal)}.merge(options)))
      buf.append(TagHelper.contentTag('label', tag + value as String, options, false))
    }
    return buf.toString()
  }

  static function submitInput(text: String = 'Submit', options: Map<String, String> = null) : String {
    return TagHelper.tag('input', {'type' -> 'submit',
                                   'value' -> text}.merge(options))
  }

  static function selectInput(literal: PropertyReference, name: String = null,
                              options: Map<String, String> = null) : String {
    var label = labelInput(name, literal)
    return label + TagHelper.contentTag('select', options(literal), {'name' -> format(literal)}.merge(options), false)
  }

  static function labelInput(name: String, literal: PropertyReference) : String {
    name = name ?: literal.PropertyInfo.DisplayName
    return TagHelper.contentTag('label', name + ': ', {'for' -> format(literal)})
  }

  /*
  * ------ Helper methods -----
   */

  private static function options(literal : PropertyReference) : String {
    var buf = new StringBuffer()
    for (value in getValues(literal)) {
      buf.append(TagHelper.contentTag("option",value as String, {'value' -> value as String}))
    }
    return buf.toString()
  }

  private static function getValues(literal : PropertyReference) : Iterable<Object> {
    if (literal.PropertyInfo.FeatureType typeis Type<Iterable>) {
      return literal.RootType[literal.PropertyInfo.Name] as Iterable<Object>
    } else if (literal.PropertyInfo.FeatureType typeis IEnumType) {
      return literal.PropertyInfo.FeatureType.EnumValues
    } else {
      throw new IllegalArgumentException()
    }
  }

  private static function format(literal : PropertyReference) : String {
    return "${literal.RootType.DisplayName}[${literal.PropertyInfo.Name}]"
  }
}