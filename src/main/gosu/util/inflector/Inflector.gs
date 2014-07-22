package util.inflector


uses java.util.ArrayList
uses java.util.regex.Matcher
uses java.util.regex.Pattern

class Inflector {

  private static var underscorePattern = Pattern.compile( "_" )
  private static var setup = setup()

  /**
   * replace underscores with dashes in a string
   *
   * @param word
   * @return
   */
  static function dasherize(word : String) : String {
    var m = underscorePattern.matcher( word )
    return m.replaceAll( "-" )
  }

  private static var dashPattern = Pattern.compile( "-" )

  /**
   * replace dashes with underscores in a string
   *
   * @param word
   * @return
   */
  static function underscorize(word : String) : String {
    var m = dashPattern.matcher(word)
    return m.replaceAll( "_" )
  }

  private static var doubleColonPattern = Pattern.compile( "::" )
  private static var underscore1Pattern = Pattern
      .compile( "([A-Z]+)([A-Z][a-z])" )
  private static var underscore2Pattern = Pattern
      .compile( "([a-z\\d])([A-Z])" )

  /**
   * The reverse of camelize. Makes an underscored form from the expression in
   * the string.
   *
   * Changes '::' to '/' to convert namespaces to paths.
   *
   * @param word
   * @return
   */
  static function underscore(word : String) : String {

    var out : String
    var m : Matcher

    m = doubleColonPattern.matcher( word )
    out = m.replaceAll( "/" )

    m = underscore1Pattern.matcher( out )
    out = m.replaceAll( "$1_$2" )

    m = underscore2Pattern.matcher( out )
    out = m.replaceAll( "$1_$2" )

    out = underscorize( out )

    return out.toLowerCase()
  }

  /**
   * return the plural form of word
   *
   * @param word
   * @return
   */
  static function pluralize(word : String) : String {
    var out = new String(word);
    if ( ( out.length() == 0 )
      || ( !uncountables.contains( word.toLowerCase() ) ) ) {
      for (var r in plurals ) {
        if ( r.find( word ) ) {
          out = r.replace( word )
          break
        }
      }
    }
    return out
  }

  static function irregular(singular : String, plural : String) {
    var regexp : String
    var repl : String

    if ( singular.substring( 0, 1 ).toUpperCase().equals(
      plural.substring( 0, 1 ).toUpperCase() ) ) {
      // singular and plural start with the same letter
      regexp = "(?i)(" + singular.substring( 0, 1 ) + ")"
          + singular.substring( 1 ) + "$";
      repl = "$1" + plural.substring( 1 );
      plurals.add( 0, new ReplacementRule( regexp, repl ) );

      regexp = "(?i)(" + plural.substring( 0, 1 ) + ")"
          + plural.substring( 1 ) + "$";
      repl = "$1" + singular.substring( 1 );
      singulars.add( 0, new ReplacementRule( regexp, repl ) );
    } else {
      // singular and plural don't start with the same letter
      regexp = singular.substring( 0, 1 ).toUpperCase() + "(?i)"
          + singular.substring( 1 ) + "$";
      repl = plural.substring( 0, 1 ).toUpperCase()
          + plural.substring( 1 );
      plurals.add( 0, new ReplacementRule( regexp, repl ) );

      regexp = singular.substring( 0, 1 ).toLowerCase() + "(?i)"
          + singular.substring( 1 ) + "$";
      repl = plural.substring( 0, 1 ).toLowerCase()
          + plural.substring( 1 );
      plurals.add( 0, new ReplacementRule( regexp, repl ) );

      regexp = plural.substring( 0, 1 ).toUpperCase() + "(?i)"
          + plural.substring( 1 ) + "$";
      repl = singular.substring( 0, 1 ).toUpperCase()
          + singular.substring( 1 );
      singulars.add( 0, new ReplacementRule( regexp, repl ) );

      regexp = plural.substring( 0, 1 ).toLowerCase() + "(?i)"
          + plural.substring( 1 ) + "$";
      repl = singular.substring( 0, 1 ).toLowerCase()
          + singular.substring( 1 );
      singulars.add( 0, new ReplacementRule( regexp, repl ) );
    }
  }

  private static var plurals : ArrayList<ReplacementRule>
  private static var singulars : ArrayList<ReplacementRule>
  private static var uncountables : ArrayList<String>

  static function setup() : int {
    plurals = new ArrayList<ReplacementRule>( 17 )
    plurals.add( 0, new ReplacementRule( "$", "s" ) )
    plurals.add( 0, new ReplacementRule( "(?i)s$", "s" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(ax|test)is$", "$1es" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(octop|vir)us$", "$1i" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(alias|status)$", "$1es" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(bu)s$", "$1es" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(buffal|tomat)o$", "$1oes" ) )
    plurals.add( 0, new ReplacementRule( "(?i)([ti])um$", "$1a" ) )
    plurals.add( 0, new ReplacementRule( "sis$", "ses" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(?:([^f])fe|([lr])f)$", "$1$2ves" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(hive)$", "$1s" ) )
    plurals.add( 0, new ReplacementRule( "(?i)([^aeiouy]|qu)y$", "$1ies" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(x|ch|ss|sh)$", "$1es" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(matr|vert|ind)(?:ix|ex)$", "$1ices" ) )
    plurals.add( 0, new ReplacementRule( "(?i)([m|l])ouse$", "$1ice" ) )
    plurals.add( 0, new ReplacementRule( "^(?i)(ox)$", "$1en" ) )
    plurals.add( 0, new ReplacementRule( "(?i)(quiz)$", "$1zes" ) )

    singulars = new ArrayList<ReplacementRule>( 24 )
    singulars.add( 0, new ReplacementRule( "s$", "" ) )
    singulars.add( 0, new ReplacementRule( "(n)ews$", "$1ews" ) )
    singulars.add( 0, new ReplacementRule( "([ti])a$", "$1um" ) )
    singulars.add( 0, new ReplacementRule(
        "((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$",
        "$1$2sis" ) )
    singulars.add( 0, new ReplacementRule( "(^analy)ses$", "$1sis" ) )
    singulars.add( 0, new ReplacementRule( "([^f])ves$", "$1fe" ) )
    singulars.add( 0, new ReplacementRule( "(hive)s$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(tive)s$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "([lr])ves$", "$1f" ) )
    singulars.add( 0, new ReplacementRule( "([^aeiouy]|qu)ies$", "$1y" ) )
    singulars.add( 0, new ReplacementRule( "(s)eries$", "$1eries" ) )
    singulars.add( 0, new ReplacementRule( "(m)ovies$", "$1ovie" ) )
    singulars.add( 0, new ReplacementRule( "(x|ch|ss|sh)es$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "([m|l])ice$", "$1ouse" ) )
    singulars.add( 0, new ReplacementRule( "(bus)es$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(o)es$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(shoe)s$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(cris|ax|test)es$", "$1is" ) )
    singulars.add( 0, new ReplacementRule( "(octop|vir)i$", "$1us" ) )
    singulars.add( 0, new ReplacementRule( "(alias|status)es$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(ox)en$", "$1" ) )
    singulars.add( 0, new ReplacementRule( "(virt|ind)ices$", "$1ex" ) )
    singulars.add( 0, new ReplacementRule( "(matr)ices$", "$1ix" ) )
    singulars.add( 0, new ReplacementRule( "(quiz)zes$", "$1" ) )

    irregular( "person", "people" )
    irregular( "man", "men" )
    irregular( "child", "children" )
    irregular( "sex", "sexes" )
    irregular( "move", "moves" )
    irregular( "cow", "kine" )

    uncountables = new ArrayList<String>( 8 )
    uncountables.add( "equipment" )
    uncountables.add( "information" )
    uncountables.add( "rice" )
    uncountables.add( "money" )
    uncountables.add( "species" )
    uncountables.add( "series" )
    uncountables.add( "fish" )
    uncountables.add( "sheep" )
    return 0
  }
}
