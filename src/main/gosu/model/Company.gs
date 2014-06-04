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
class Company extends DataSetEntry {

  construct(dataSetName : String) {
    super(dataSetName)
  }

  property set CompanyName(companyName : String) {
    super.put("companyName", companyName)
    return
  }
  property get CompanyName() : String {
    return super.get("companyName") as String
  }

  property set ContactName(contactName : String) {
    super.put("contactName", contactName)
    return
  }
  property get ContactName() : String {
    return super.get("contactName") as String
  }

  property set Email(email : String) {
    super.put("email", email)
    return
  }
  property get Email() : String {
    return super.get("email") as String
  }

  property set Region(region : String) {
    super.put("region", region)
    return
  }
  property get Region() : String {
    return super.get("region") as String
  }

  property set Policies(policies : Map<String, BigDecimal>) {
    super.put("policies", policies)
    return
  }
  property get Policies() : Map<String, BigDecimal> {
    return super.get("policies") as Map<String, BigDecimal>
  }

}