var hasMapInit = false;

$(document).ready(function() {
	$('.send_message').on('click',function(){
		
	});


});

$(document).delegate('#page2', 'pageshow', function() {
	// alert(1);
	if (!hasMapInit) {
		loadMap();
		hasMapInit = true;
	} else {
		// calcRoute(start, end);
	}
});