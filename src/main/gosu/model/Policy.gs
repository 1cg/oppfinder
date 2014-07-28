package model

class Policy {

  var _policy : String as Policy
  var _value : int as Value

  construct() {
    _policy = null
    _value = 0
  }

  construct(policy : String, value : int) {
    _policy = policy
    _value = value
  }

  override function equals(obj : Object) : boolean {
    if (!(obj typeis Policy)) return false
    return (obj as Policy).Policy == _policy
  }

  override function hashCode() : int {
    return _policy.hashCode()
  }

  override function toString() : String {
    return _policy + ' : ' + _value
  }

}