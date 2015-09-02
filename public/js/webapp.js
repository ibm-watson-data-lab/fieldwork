//-- initialize map
var map = L.map('map').setView([42.35, -71.05], 16); // Boston

L.mapbox.accessToken = 'pk.eyJ1IjoicmFqcnNpbmdoIiwiYSI6ImpzeDhXbk0ifQ.VeSXCxcobmgfLgJAnsK3nw';
L.mapbox.tileLayer('mapbox.pencil').addTo(map);

L.control.scale().addTo(map);

//-- get map configuration settings
var mapconfig = null;
$.ajax({
  url: '/mapconfig',
  async: false,
  dataType: 'json',
  success: function (response) {
    mapconfig = response;
  }
});

//-- initialize databases
var remotedbs = new Array(mapconfig.geodata.length);
var editdb = null;
var remoteediturl = 'https://'+mapconfig.editlayer.key+':'+mapconfig.editlayer.password+
                    '@'+mapconfig.editlayer.key+'.cloudant.com/' + mapconfig.editlayer.name;
var remoteeditdb = new PouchDB(remoteediturl);
var maplayers = new Array(mapconfig.geodata.length+1);

var annoMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(30, 44),
        iconUrl: './css/images/pushpin.png'
    }
});

//-- database init
// for (var i = 0; i < mapconfig.geodata.length; i++) {
// 	remotedbs[i] = new PouchDB(mapconfig.geodata[i].name);
// 	remotedbs[i].destroy().then(function () {
// 		remotedbs[i] = new PouchDB(mapconfig.geodata[i].name);
// 	});
// }

//-- map layers setup
var st = {radius: 12, fillColor: '#6157B9', fillOpacity: 0.2, color: '#6157B9'};
for (var i = 0; i < mapconfig.geodata.length; i++) {
	var dataset = mapconfig.geodata[i];
	if (dataset.type === 'Point') {
		maplayers[i] = L.geoJson(null, {
			onEachFeature: onEachFeature, 
			pointToLayer: function(feature, latlng) { return L.circleMarker(latlng, dataset.style)}
			// pointToLayer: function(feature, latlng) { return L.circleMarker(latlng, st)}
		});//.addTo(map);
	} else {
		maplayers[i] = L.geoJson(null, {
			onEachFeature: onEachFeature, 
			style: mapconfig.geodata[i].style
		});//.addTo(map);
	}
}

//-- layer control setup
function addOverlaysControl() {
  var overlayMaps = {};
  for (var i = 0; i < mapconfig.geodata.length; i++) {
  	overlayMaps[mapconfig.geodata[i].name] = maplayers[i];
  }
  L.control.layers(null, overlayMaps, {collapsed:false,autoZIndex:true}).addTo(map);
}

// editable layer
var editlayer = L.geoJson(null, {
	onEachFeature: onEachEditFeature, 
	pointToLayer: function(feature, latlng) { return L.marker(latlng, {icon: new annoMarker()} ) }
}).addTo(map);

function onEachFeature(feature, layer) {
    if (feature.properties) {
		var pop = '';
		for (var k in feature.properties) {
			pop += '<b>' + k + ': </b> ' + feature.properties[k] + '<br/>';
		}
		layer.bindPopup(pop);
    }
}

function onEachEditFeature(feature, layer) {
	onEachFeature(feature, layer);
}

function updateProperties(formelement) {
	alert('here with '+formelement);
}

////---- Code around editing the layer
var drawControl = null;
function editFeatures() {
	if ( drawControl != null ) return;
	
	drawControl = new L.Control.Draw({
	    edit: {
	        featureGroup: editlayer
	    },
		draw: {
			marker: {
				icon: new annoMarker()
			},
			polygon: false, 
			polyline: false, 
			circle: false, 
			rectangle: false
		}
	});
	map.addControl(drawControl);	
}

////---- sync pipe and annotation edits to host
function syncFeatures() {
	PouchDB.sync(editdb, remoteeditdb);
}

/**
 * Take action when user is done creating a new layer (feature)
 * Create a feature object and set geometry, geometry bbox, and properties, and update pouch
 */
map.on('draw:created', function (e) {
	// pop up a window to add an annotation comment
	var anno = "none";
	bootbox.prompt("Comment:", function(result) {
		if (result != null) {
			anno = result;
		}
		// make a new GeoJSON feature using this layer
		var newfeature = L.layerGroup([e.layer]).toGeoJSON().features[0];
		newfeature.properties.annotation = anno;
	
		// compute bbox
		var newbbox = null;
		if ( e.layerType == "marker") {
			newbbox = L.latLngBounds(e.layer._latlng, e.layer._latlng);
		} else {
			newbbox = L.latLngBounds(e.layer._latlngs);
		}
		newfeature.geometry.bbox = 
			[newbbox.getWest(),newbbox.getSouth(),newbbox.getEast(),newbbox.getNorth()];
		// insert into pouch
		editdb.post(newfeature, function(err, response) {
			if (err) sendMessage("Error adding new feature. Error: "+err.toString());
			else {
				// e.layer.feature = newfeature;
				// e.layer.feature._id = response.id;
				// e.layer.feature._rev = response.rev;
				// editlayer.addLayer(e.layer);
				newfeature._id = response.id;
				newfeature._rev = response.rev;
				editlayer.addData(newfeature);
        // notifier.show("Added new feature.");
        sendMessage("\nAdded new feature. Response: " + JSON.stringify(response));
			}
		});
	});
});

/**
 * Take action when user is done editing a layer (feature)
 * Set the layer's feature coordinates to new latlngs, update the bbox, and update pouch
 */
map.on('draw:edited', function (e) {
	e.layers.eachLayer(function(layer) {
		var newfeature = L.layerGroup([layer]).toGeoJSON();
		layer.feature.geometry.coordinates = newfeature.features[0].geometry.coordinates;
		// compute bbox
		var newbbox = null;
		if ( layer._latlngs) {
			newbbox = L.latLngBounds(layer._latlngs);
		} else {
			newbbox = L.latLngBounds(layer._latlng, layer._latlng);
		}
		layer.feature.geometry.bbox = 
			[newbbox.getWest(),newbbox.getSouth(),newbbox.getEast(),newbbox.getNorth()];
		// put new version of doc into pouch
		editdb.put( layer.feature, function(err, response) {
			if (err) {
				sendMessage("Error editing: "+layer.feature._id+". Error: " + err.toString());
			} else {
				sendMessage("Edited: "+layer.feature._id+". Response: " + response.toString());
			}
		});
	});
});

/**
 * Take action when user is done deleting a layer (feature)
 * Set the layer's feature _deleted property to true and update pouch
 */
map.on('draw:deleted', function (e) {
    e.layers.eachLayer(function (layer) {
		layer.feature._deleted = true;
		editdb.remove( layer.feature, function(err, response) {
			if (err) sendMessage("Error removing: "+layer.feature._id+". Error: "+err.toString());
			else {
				sendMessage("Removed: "+layer.feature._id+". Response: "+response.toString());
			}
		});
    });
});

$(function() {
	notifier.init({
		"selector": ".bb-alert"
	});
});
var notifier = (function() {
    "use strict";

    var elem,
        hideHandler,
        that = {};

    that.init = function(options) {
        elem = $(options.selector);
    };

    that.show = function(text) {
        clearTimeout(hideHandler);

        elem.find("span").html(text);
        elem.delay(200).fadeIn().delay(4000).fadeOut();
    };

    return that;
}());

function sendMessage(strarray) {
  if (typeof strarray === 'string') strarray = [strarray];
  var m = $('#messages');
  m.html(m.html() + '<hr>');
  for (var i = 0; i < strarray.length; i++) {
    var str = strarray[i];
    if (typeof str == 'object' ) str = JSON.stringify(str);
    m.html( m.html() + str + '<br/>' );
  }
  m.scrollTop(m[0].scrollHeight);
}
