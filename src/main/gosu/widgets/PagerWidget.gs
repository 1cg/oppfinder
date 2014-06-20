package widgets

uses model.Pager

class PagerWidget {

  static function renderWidget(pager : Pager, path : String) : String {
    return PagerView.renderToString(pager, path)
  }

}