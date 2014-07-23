// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require_tree .
//= require tinymce-jquery

$(function(){ 
	$(document).foundation(); 

	$(".megamenu").mouseenter(function(){

	  if($(window).width()>641){
	  	var menuWidth = $(window).width() / 1.5;
	  	var offsetLeft = $(window).width() / 5;
	    $(".dropdown-wrapper").offset({left: offsetLeft});
	    $(".dropdown-wrapper").css("width", menuWidth);
	    $(".dropdown-wrapper").css("margin", auto);
	  }else{
	    $(".dropdown-wrapper").css("width", auto);
	  }
	  
	});

});

