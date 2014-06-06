package model

uses java.util.Map
uses java.math.BigDecimal


class Company extends DataSetEntry {

  construct(dataSetName : String) {
    super(dataSetName)
  }

  property set CompanyName(companyName : String) {
    put("Company", companyName)
  }
  property get CompanyName() : String {
    return get("Company") as String
  }

  property set ContactName(contactName : String) {
    put("Contact Name", contactName)
  }
  property get ContactName() : String {
    return get("Contact Name") as String
  }

  property set Email(email : String) {
    put("Email", email)
  }
  property get Email() : String {
    return get("Email") as String
  }

  property set Region(region : String) {
    put("Region", region)
  }
  property get Region() : String {
    return get("Region") as String
  }

  property set Policies(policies : /* Map<String, BigDecimal> */ String) {
    put("Policies", policies)
  }
  property get Policies() : /*Map<String, BigDecimal>*/ String {
    return get("Policies") /*as Map<String, BigDecimal>*/as String
  }

  static property get CompanyDataTypes() : List<String> {
    return {"Company", "Contact Name", "Email", "Region", "Policies"}
  }

}