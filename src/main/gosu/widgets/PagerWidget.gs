package widgets

uses model.Pager

class PagerWidget {

  static function renderWidget(pager : Pager, path : String, type : String) : String {
    return PagerView.renderToString(pager, path, type)
  }

}