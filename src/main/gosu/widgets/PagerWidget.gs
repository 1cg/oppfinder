package widgets

uses sparkgs.util.IHasRequestContext

class PagerWidget implements IHasRequestContext {

  function renderWidget(pager : util.PagerIterable) : String {
    return PagerView.renderToString(pager, Request.URL.replace("/table",""), (Params['page'])?.toLong())
  }

  static function replacePage(URL : String, value : String) : String {
    return URL + "?page=" + value
  }

}