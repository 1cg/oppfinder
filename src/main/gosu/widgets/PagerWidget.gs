package widgets

uses model.Pager
uses sparkgs.util.IHasRequestContext

class PagerWidget implements IHasRequestContext {

  static function renderWidget(pager : Pager, path : String, type : String) : String {
    return PagerView.renderToString(pager, path, type)
  }

}