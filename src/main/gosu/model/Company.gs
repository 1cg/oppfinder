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

  property set Size(size : String) {
    put("Size", size)
  }

  property get Size() : String {
    return get("Size") as String
  }

  property get Reach() : String {
    return get("Reach") as String
  }

  property set Reach(reach : String) {
    put("Reach", reach)
  }

  property get Revenue() : String {
    return get("Revenue") as String
  }

  property set Revenue(revenue : String) {
    put("Revenue", revenue)
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