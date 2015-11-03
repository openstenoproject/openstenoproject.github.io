// JavaScript Document

$(document).ready(function(){

  $('section').hide();
  $("#show").click(function () {
     $("section").slideToggle(1000);
  });
  $('#transcript section').show();
	$(".button").hover(function(){
  		$(this).css("background","#876925");
  	},function(){
  		$(this).css("background","#C89D39");
	});
	$("#header-details .fa-stack").hover(function(){
  		$(this).css("color","#876925");
  	},function(){
  		$(this).css("color","#C89D39");
	});
	$("header a.linkUnderline").hover(function(){
  		$(this).css("border-bottom","0");
		$(this).css("padding-bottom","4px");
  	},function(){
  		$(this).css("border-bottom","2px solid #fff");
		$(this).css("padding-bottom","2px");
	});
	$("footer a.linkUnderline").hover(function(){
  		$(this).css("border-bottom","0");
		$(this).css("padding-bottom","4px");
  	},function(){
  		$(this).css("border-bottom","2px solid #fff");
		$(this).css("padding-bottom","2px");
	});
  $("#show").hover(function(){
  		$("#show p").css("border-bottom","0");
		$("#show p").css("padding-bottom","4px");
  	},function(){
  		$("#show p").css("border-bottom","2px solid #066");
		$("#show p").css("padding-bottom","2px");
	});
  $("#steno").click(function(){
    $("#steno-details").slideToggle(1000);
  });
  $("#plover").click(function(){
    $("#plover-details").slideToggle(1000);
  });
  $("#users").click(function(){
    $("#users-details").slideToggle(1000);
  });
  $("#start").click(function(){
    $("#start-details").slideToggle(1000);
  });
  $("#hardware").click(function(){
    $("#hardware-details").slideToggle(1000);
  });
  $("#hardware-icon").click(function(){
    $("#hardware-details").slideDown(1000);
  });
  $("#people").click(function(){
    $("#people-details").slideToggle(1000);
  });
  $("#resources").click(function(){
    $("#resources-details").slideToggle(1000);
  });
  $("#contact").click(function(){
    $("#contact-details").slideToggle(1000);
  });

  var media = $('link[href$="print.css"]').attr('media');
  if (media) { $('section').show(); }

});
