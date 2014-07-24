package util.inflector

uses java.util.regex.Matcher
uses java.util.regex.Pattern

public class ReplacementRule {

  private var p : Pattern
  private var m : Matcher
  private var r : String

  construct(regexp : String, replacement : String) {
    p = Pattern.compile(regexp)
    r = replacement
  }

  function find(word : String) : boolean {
  m = p.matcher(word)
  return m.find()
  }

  function replace(word : String) : String {
  m = p.matcher(word)
  return m.replaceAll(this.r)
  }
}