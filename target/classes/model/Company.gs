package model

uses java.util.Map
uses java.util.HashMap
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: jchoi
 * Date: 6/4/14
 * Time: 1:06 PM
 * To change this template use File | Settings | File Templates.
 */
class Company {
  var info : Map<String, Object>
  var myDataSet : DataSet

  construct(dataSet : DataSet) {
    info = new HashMap<String, Object>()
    myDataSet = dataSet
  }

  // Saves this company info into the mongo dataset
  function save() {
    myDataSet.insert(info)
    return
  }

  function delete() {
    myDataSet.remove(info)
  }

  static function deleteAllCompanies(dataSet : DataSet) {
    dataSet.drop()
  }

  property set CompanyName(companyName : String) {
    info.put("companyName", companyName)
    return
  }
  property get CompanyName() : String {
    return (String)info.get("companyName")
  }

  property set ContactName(contactName : String) {
    info.put("contactName", contactName)
    return
  }
  property get ContactName() : String {
    return (String)info.get("contactName")
  }

  property set Email(email : String) {
    info.put("email", email)
    return
  }
  property get Email() : String {
    return (String)info.get("email")
  }

  property set Region(region : String) {
    info.put("region", region)
    return
  }
  property get Region() : String {
    return (String)info.get("region")
  }

  property set Policies(policies : Map<String, BigDecimal>) {
    info.put("policies", policies)
    return
  }
  property get Policies() : Map<String, BigDecimal> {
    return (Map<String, BigDecimal>)info.get("policies")
  }

}