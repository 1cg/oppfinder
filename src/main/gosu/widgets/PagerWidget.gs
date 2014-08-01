package widgets

uses sparkgs.util.IHasRequestContext

class PagerWidget implements IHasRequestContext {

  function renderWidget(pager : model.database.iterable.PagerIterable) : String {
    return PagerView.renderToString(pager, Request.URL.replace("/table","").replace("/subjobtable",""), (Params['page'])?.toLong())
  }

  static function replacePage(URL : String, value : String) : String {
    return URL + "?page=" + value
  }

}