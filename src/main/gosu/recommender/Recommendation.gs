package recommender

uses org.apache.mahout.cf.taste.recommender.RecommendedItem
uses util.MahoutUtil

class Recommendation {

  var recommendation : String as Recommendation
  var preference : float as Preference
  var id : String as Id

  construct(recommended : RecommendedItem, companyId : String) {
    this.recommendation  = MahoutUtil.longToPolicy(recommended.ItemID)
    this.preference = recommended.Value
    this.id = companyId
  }

}