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

function toggle(source, name) {
  checkboxes = document.getElementsByName(name);
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}