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
uses com.mongodb.BasicDBObject
uses org.apache.shiro.authc.UnknownAccountException
uses com.mongodb.DBObject
uses org.apache.shiro.authc.SimpleAuthenticationInfo
uses org.apache.shiro.authz.SimpleAuthorizationInfo
uses org.apache.shiro.authc.IncorrectCredentialsException

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

  construct(collection : DBCollection) {
    this()
    this._collection=collection
  }

  property set Collection(collection : DBCollection) {
    this._collection = collection
  }

  override function supports(token : AuthenticationToken) : boolean {
    return token typeis UsernamePasswordToken
  }

  function createUserCredentials(username : String, plainTextPassword : String) : DBObject {
    var salt = rng.nextBytes()
    var pw = new Sha256Hash(plainTextPassword, salt, hashIterations).toBase64()

    var obj = new BasicDBObject()
    obj.put("name", username)
    obj.put("password", pw)
    obj.put("salt", salt.toBase64())
    obj.put("algorithm", Sha256Hash.ALGORITHM_NAME)
    obj.put("hashIterations", hashIterations)


    return obj
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

    var obj = _collection.findOne(new BasicDBObject("name",token.Username))
    if (obj == null) {
      throw new UnknownAccountException("Unknown user "+token.Username)
    }

    var salt = Sha256Hash.fromBase64String(obj.get("salt") as String)
    var hashedPW = obj.get("password") as String //hashed, converted to Base64

    if (new Sha256Hash(token.Password, salt, hashIterations).toBase64() == hashedPW) {
      return new SimpleAuthenticationInfo(obj.get("name"), token.Password, salt, getName())
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
    var info = new SimpleAuthorizationInfo()
    var cursor = _collection.find( new BasicDBObject("_id", new BasicDBObject("$in",p0.asList())))

    for(p in cursor) {
      var rolesObj = p.get("roles")
      if (rolesObj != null && rolesObj typeis List<?>) {
      }
      for(r in rolesObj as List<Object>) {
        info.addRole(r.toString())
      }

      var permissionsObj = p.get("permissions")
      if(permissionsObj != null && permissionsObj typeis List<?>) {
        for(r in permissionsObj) {
          info.addStringPermission(r.toString())
        }
      }
    }
    return info
  }

}