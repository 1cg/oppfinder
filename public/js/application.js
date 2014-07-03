$(function(){

  function addRowActionButtonHandler() {
    $('tr:has(.row-action-btns)').mouseenter(function(){
      $(this).find(".row-action-btns").show();
    }).mouseleave(function(){
          $(this).find(".row-action-btns").hide();
    });
  }
  addRowActionButtonHandler();

  $("body").on("complete.ic", function() {
    addRowActionButtonHandler();
  });

})