package auth

uses org.apache.shiro.realm.AuthorizingRealm
uses org.apache.shiro.authc.AuthenticationInfo
uses org.apache.shiro.authc.AuthenticationToken
uses org.apache.shiro.authz.AuthorizationInfo
uses org.apache.shiro.subject.PrincipalCollection
uses com.mongodb.DBCollection
uses org.apache.shiro.authc.credential.HashedCredentialsMatcher
uses org.apache.shiro.crypto.hash.Sha256Hash
uses org.apache.shiro.crypto.SecureRandomNumberGenerator
uses org.apache.shiro.authc.UsernamePasswordToken
uses org.apache.shiro.authc.AuthenticationException
uses org.apache.shiro.authc.UnknownAccountException
uses org.apache.shiro.authc.SimpleAuthenticationInfo
uses org.apache.shiro.authz.SimpleAuthorizationInfo
uses org.apache.shiro.authc.IncorrectCredentialsException
uses model.User

class MongoUserPasswordRealm extends AuthorizingRealm {
  public static final var DEFAULT_AUTH_FIELD : String = "passwordAuthentication"
  public static final var DEFAULT_NAME_FIELD : String = DEFAULT_AUTH_FIELD+".name"
  public static final var DEFAULT_PASSWORD_FIELD : String[] = new String[] {DEFAULT_AUTH_FIELD,"password"}
  public static final var DEFAULT_SALT_FIELD : String[] = new String[] {DEFAULT_AUTH_FIELD, "salt"}

  protected var hashIterations : int = 100000
  protected var userNamePath : String = DEFAULT_NAME_FIELD
  protected var passwordPath : String[] = DEFAULT_PASSWORD_FIELD
  protected var saltPath : String[] = DEFAULT_SALT_FIELD

  protected var _collection : DBCollection
  protected var matcher : HashedCredentialsMatcher = new HashedCredentialsMatcher(Sha256Hash.ALGORITHM_NAME)
  var rng = new SecureRandomNumberGenerator()

  construct() {
    matcher.setHashIterations(hashIterations)
    matcher.setStoredCredentialsHexEncoded(false)
  }

  override function supports(token : AuthenticationToken) : boolean {
    return token typeis UsernamePasswordToken
  }

  function saveUserCredentials(username : String, plainTextPassword : String) {
    var salt = rng.nextBytes()
    var pw = new Sha256Hash(plainTextPassword, salt, hashIterations).toBase64()
    var user = new User()
    user.Name = username
    user.put("password", pw)
    user.put("salt", salt.toBase64())
    user.put("algorithm", Sha256Hash.ALGORITHM_NAME)
    user.put("hashIterations", hashIterations)
    user.save()
  }

  /*
   * Retrieves authentication data from an implementation-specific datasource (RDBMS, LDAP, etc) for
   * the given authentication token.
   *
   * For most datasources, this means just 'pulling' authentication data for an associated subject/user
   * and nothing more and letting Shiro do the rest. But in some systems, this method could actually
   * perform EIS specific log-in logic in addition to just retrieving data - it is up to the Realm
   * implementation.
   *
   * A null return value means that no account could be associated with the specified token.
   *
   * Parameters:
   * token - the authentication token containing the user's principal and credentials.
   *
   * Returns
   * an AuthenticationInfo object containing account data resulting from the authentication ONLY if
   * the lookup is successful (i.e. account exists and is valid, etc.)
   *
   */
  override function doGetAuthenticationInfo(authToken: AuthenticationToken): AuthenticationInfo {
    if (!(authToken typeis UsernamePasswordToken)) {
      throw new AuthenticationException("This realm only supports UsernamePasswordTokens")
    }

    var token = authToken as UsernamePasswordToken
    if(token.Username == null) {
      throw new AuthenticationException("Cannot log in null user")
    }
    var user = User.find(token.Username)
    if (user == null) {
      throw new UnknownAccountException("Unknown user "+token.Username)
    }

    var salt = Sha256Hash.fromBase64String(user.get("salt") as String)
    var hashedPW = user.get("password") as String //hashed, converted to Base64

    if (new Sha256Hash(token.Password, salt, hashIterations).toBase64() == hashedPW) {
      return new SimpleAuthenticationInfo(user.Name, token.Password, salt, getName())
    } else {
      throw new IncorrectCredentialsException()
    }
  }

  /*
   * Retrieves the AuthorizationInfo for the given principals from the underlying data store.
   * When returning an instance from this method, you might want to consider using an instance
   * of SimpleAuthorizationInfo, as it is suitable in most cases.
   *
   * Parameters:
   * principals - the primary identifying principals of the AuthorizationInfo that should be retrieved.
   *
   * Returns:
   * the AuthorizationInfo associated with this principals.
   *
   */
  override function doGetAuthorizationInfo(p0: PrincipalCollection): AuthorizationInfo {
    print("Getting AuthorizationInfo")
    var info = new SimpleAuthorizationInfo()
    info.setRoles({"standard_user"})
    info.setStringPermissions({}) //set them to the set of permissions (collections?) associated with this username.
    return info
  }

}