package model

class Company extends DataSetEntry {

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

  property set Policies(policies : String) {
    put("Policies", policies)
  }
  property get Policies() : String {
    return get("Policies") as String
  }

  static property get CompanyDataTypes() : List<String> {
    return {"Company", "Contact Name", "Email", "Region", "Policies"}
  }

}