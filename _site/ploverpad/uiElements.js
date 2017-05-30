// make the standard keyboard draggable and resizable. when it is dragged, let it snap to other elements. when it is resized, keep it proportional.
$("#stdKeyboard").draggable({snap: true}).resizable({aspectRatio: 750 / 250,
	resize: function(event, ui) {
		var keyHeight = parseInt($(this).children(".stdRow").css("height"));
		$(".stdKey").css({"font-size": (keyHeight * 0.9 / 3) + "px"});
		$(".stdKey").css({"line-height": (keyHeight * 0.9) + "px"});
		$(".stdKey").children(".upper").css({"line-height": (keyHeight * 0.9 / 3 * 2) + "px"});
		$(".stdKey").children(".lower").css({"line-height": (keyHeight * 0.9 / 3) + "px"});
	}
});

// make the steno keyboard draggable and resizable. when it is dragged, let it snap to other elements. when it is resized, keep it proportional.
$("#stenoKeyboard").draggable({snap: true}).resizable({aspectRatio: 320 / 160,
	resize: function(event, ui) {
		var keyHeight = parseInt($(this).children(".stenoUpperBank").css("height"));
		$(".stenoKey").css({"font-size": (keyHeight / 2) + "px"});
		$(".stenoKey").css({"line-height": (keyHeight) + "px"});
	}
});

// make the papers draggable and resizable. when it is dragged, let it snap to other elements.
$("#verticalNotesContainer").draggable({snap: true}).resizable({handles: 's',
	alsoResize: "#outputContainer",
	resize: function(event, ui) {
		var containerHeight = parseInt($(this).css("height"));
		$("#verticalNotes").css({"height": (containerHeight - 50) +"px"});
		$("#output").css({"height": (containerHeight - 50) +"px"});
	}
});

$("#outputContainer").draggable({snap: true}).resizable({handles: 's',
	alsoResize: "#verticalNotesContainer",
	resize: function(event, ui) {
		var containerHeight = parseInt($(this).css("height"));
		$("#verticalNotes").css({"height": (containerHeight - 50) +"px"});
		$("#output").css({"height": (containerHeight - 50) +"px"});
	}
});
