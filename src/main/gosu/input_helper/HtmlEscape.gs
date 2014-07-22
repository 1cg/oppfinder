package input_helper

uses org.apache.commons.lang3.StringEscapeUtils

class HtmlEscape {

  static function escape(content : String) : String {
    return StringEscapeUtils.escapeHtml4(content)
  }

}