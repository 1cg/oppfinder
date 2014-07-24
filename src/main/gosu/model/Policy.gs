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


}