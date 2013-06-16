var infowindow;
var map;
var geocoder;
var lat;
var lng;
var selectedUsers = [];
var users = [];
var markerArray = [];
var currName;
var myCity;

users[0] = new Object
users[0].name = "hao"
users[0].lat = 37.37711451576145
users[0].lng = -121.91399574279785
users[1] = new Object
users[1].name = "cris"
users[1].lat = 37.37997911184045
users[1].lng = -121.90841674804688
users[2] = new Object
users[2].name = "sunny"
users[2].lat = 37.38795848110175
users[2].lng = -121.9233512878418
users[3] = new Object
users[3].name = "mike"
users[3].lat = 37.37247636632477
users[3].lng = -121.92858695983887
users[4] = new Object
users[4].name = "jon"
users[4].lat = 37.37554576202032
users[4].lng = -121.93519592285156

function load() {
	navigator.geolocation.getCurrentPosition(userLocation, error);
}


function initMap() {

	var mapOptions = {
		zoom: 19,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(lat, lng),
		zIndex: 1,
		icon: 'img/me.png'
	});

	google.maps.event.addListener(marker, 'click', function() {
		if (infowindow) infowindow.close();
		infowindow = new google.maps.InfoWindow({
			content: generateInfo(),
			maxWidth: 310
		});
		infowindow.open(map, marker);
	});
	createCircle();
}

function createCircle() {
	currName = $('#userInput').val().trim();
	myCity = new google.maps.Circle({
		center: new google.maps.LatLng(lat, lng),
		radius: 25,
		strokeColor: "orange",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "orange",
		fillOpacity: 0.4,
		draggable: false,
		editable: true,
		clickable: false
	});
	clearOverlays();

	createMarkers();
	myCity.setMap(map);
	google.maps.event.addListener(myCity, 'radius_changed', function() {
		console.log(meterToMi(myCity.getRadius()));
		selctedUsers = [];
		clearOverlays();
		createMarkers();
	});

}

function createMarkers() {
	console.log("entter Marker");
	for (var i = 1; i < database.length; i++) {
		var distance = meterToMi(myCity.getRadius()) * 1.60934;
		console.log(i+ ". distance = " + distance);
		console.log(i+ ". name = " + database[i].name);
		console.log(i+ ". coord: " + database[i].data.lat + "," + database[i].data.lng);
		console.log(i+ ". your coord: " + lat + "," + lng);
		if (haversine(lat, lng, database[i].data.lat, database[i].data.lng, distance)) {
			if (currName != database[i].name) {
				console.log("inside");
				var marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(database[i].data.lat, database[i].data.lng),
					zIndex: 1,
					icon: 'img/'+"Logo" +'.png',
					title: database[i].name + ": " + database[i].data.phone
				});
				google.maps.event.addListener(marker, 'click', function() {
					var split = this.title.split(': ');
					console.log(split[1]);
					selectedUsers.push(split[1]);
				});
				google.maps.event.addListener(marker, 'dblclick', function() {
					for (var i = 0; i < selectedUser.length; i++) {
						if (selectedUsers[i] == marker.title) {
							selectedUsers.splice(i, 1);
						}
					};
				});
				markerArray.push(marker);
			}
		}
	};
}


function codeAddress(place) {

	var address = place;

	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

function generateInfo() {
	text = '<div class="marker">';
	text += '<p> This is you! </p>';
	text += '</div>';
	return text;
}

function haversine(nlat, nlong, mlat, mlong, distance) {

	var R = 6371; // radius of earth in km
	var distances = [];
	var closest = -1;
	var dLat = rad(mlat - nlat);
	var dLong = rad(mlong - nlong);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(nlat)) * Math.cos(rad(nlat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	console.log("haver - "+d);
	if (d < distance) {
		return 1;
	} else {
		return 0;
	}
}

function rad(x) {
	return x * Math.PI / 180;
}

function meterToMi(distanceFt) {
	return distanceFt / 1609.24;
}

function clearOverlays() {

	var size = markerArray.length;
	for (var i = 0; i < size; i++) {
		var marker = markerArray.pop();
		marker.setMap(null);
	}
}
// google.maps.event.addDomListener(window, 'load', load)

var userLocation = function(pos) {
	lat = pos.coords.latitude;
	lng = pos.coords.longitude;
}

var error = function(error) {
	if (error.code === 1) {
		alert('Unable to get location');
	}
}