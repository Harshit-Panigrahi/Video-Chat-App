$(function(){
  $("#show_chat").click(function(){
    console.log("hello")
    $(".left-window").css("display", "none");
    $(".right-window").css("display", "block");
    $("#header_back").css("display", "block");
  })
  $("#header_back").click(function(){
    $(".left-window").css("display", "block");
    $(".right-window").css("display", "none");
    $("#header_back").css("display", "none");
  })
})
