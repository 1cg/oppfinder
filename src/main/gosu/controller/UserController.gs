package controller

uses sparkgs.IResourceController
uses sparkgs.util.IHasRequestContext
uses org.apache.shiro.config.IniSecurityManagerFactory
uses org.apache.shiro.SecurityUtils
uses org.apache.shiro.authc.UsernamePasswordToken
uses org.apache.shiro.authc.UnknownAccountException
uses org.apache.shiro.authc.IncorrectCredentialsException
uses org.apache.shiro.authc.LockedAccountException
uses org.apache.shiro.authc.AuthenticationException
uses org.apache.shiro.mgt.RealmSecurityManager
uses model.Database
uses org.apache.shiro.realm.AuthorizingRealm
uses com.mongodb.DBObject
uses auth.MongoUserPasswordRealm
uses org.apache.shiro.subject.Subject

class UserController implements IHasRequestContext, IResourceController {
  var _realm : MongoUserPasswordRealm
  var _subject : Subject

  construct(realm : MongoUserPasswordRealm, subject : Subject) {
    _realm = realm
    _subject = subject
  }

  //GET Sign In Page
  override function index(): Object {
    Layout = null
    return view.login.Login.renderToString()
  }



  // POST TO the index leads to this guy. This should be create account
  override function create(): Object {
    var username = Params['username']
    var password = Params['password']
    print("creating: "+username + ", "+password)

    var db = Database.INSTANCE.getCollection("MONGO_USER_AUTHENTICATION")
    var DBObj = new DBObject[] { _realm.createUserCredentials(username, password)}
    db.insert(DBObj)

    // prints out the stuff in the current realm database
    try {
      var s1 = db.find()
      for ( yo in s1.iterator()) {
        print(yo)
      }
    } catch (e) {
      print(e)
    }

    return null
  }




  function login() : Object {

   // var currentUser = SecurityUtils.getSubject()
    var currentUser = _subject
    if (!currentUser.isAuthenticated()) {
      var token = new UsernamePasswordToken(Params['username'], Params['password'])
      token.setRememberMe(true)
      try {
        // Authenticates the subject
        currentUser.login(token)

        if (currentUser.isAuthenticated()) {
          print("user authenticated")
          print("auth user: "+currentUser.getPrincipal())
          return "Authenticated!"
        } else {
          print("dafuq")
        }
      } catch(uae : UnknownAccountException) { // need to get to handling this on front end
        print("username doesn't exist")
      } catch(ice : IncorrectCredentialsException) {
        print("password didn't match: "+ice)
      } catch(lae : LockedAccountException) {
        print("account for that username is locked")
      } catch(ae : AuthenticationException) {
        print("authentication exception "+ae)
        throw(ae)
      }
    }
    return null
  }

  function logout() : Object {
    SecurityUtils.getSubject().logout()
    return null
  }

  override function _new(): Object {
    return null
  }

  override function show(id: String): Object {
    return null
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }


}