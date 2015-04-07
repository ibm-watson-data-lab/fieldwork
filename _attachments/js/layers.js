/** Add PouchDB docs to Leaflet map */
function updateMapLayer(pdb, maplayer) {
	console.log('Adding a map layer');
	pdb.allDocs( {include_docs: true} ).then(function (result) {
		maplayer.clearLayers();
		for (var i = 0; i < result.rows.length; i++) {
			if ( result.rows[i].doc.geometry && result.rows[i].doc.geometry.coordinates )
				maplayer.addData(result.rows[i].doc);
		}
	}).catch(function (err) {
		console.log('Error loading data from pouchdb to map: '+err);
	});
}

function loadFromCloudantQuery(queryobj, pdb, maplayer) {
	console.log("REQUESTING: "+queryobj.url);
	$.ajax(queryobj)
	.done(function (data) {
		data = JSON.parse(data);
		if (data.rows) {
			if (data.rows.length > 0) {
				var gs = new Array();
				for (var i = 0; i < data.rows.length; i++) gs.push(data.rows[i].doc);
				// save features into pouchdb
				pdb.bulkDocs(gs, {new_edits:false}).then(function (result) {
					// console.log('Pouch load result: '+JSON.stringify(result));
					if (data.bookmark) {
						if ( queryobj.url.indexOf('bookmark=') > 0 ) 
							queryobj.url = queryobj.url.substring(0, queryobj.url.indexOf('&bookmark='));
						queryobj.url += '&bookmark='+data.bookmark;
						loadFromCloudantQuery(queryobj, pdb, maplayer);
					}
				}).catch(function (err) {
					console.error('Error posting bulk docs: '+err);
				});
			} else { // no more rows
				updateMapLayer(pdb, maplayer);
			}
		} else {
			console.error("Error retrieving GeoJSON features");
		}
	})
	.fail(function(jqxhr, textStatus, error) {
		console.log('query failed: '+error.toString());//+'Trying to load map layer from PouchDB cache...');
		// updateMapLayer(pdb, maplayer);
	});	
}

/* get a single base data layer from Cloudant identified by the array index 
 * and put it into a PouchDB database and then onto a Leaflet GeoJSON layer on the map */
function loadLayer(idx, bbox) {
	remotedbs[idx] = new PouchDB(config.geodata[idx].name);
	var queryobj = buildQueryObject(config.geodata[idx], bbox);
	loadFromCloudantQuery(queryobj, remotedbs[idx], maplayers[idx]);
}

function loadEditableLayer(bbox) {
	editdb = new PouchDB(config.editlayer.name);
	editdb.replicate.to(remoteeditdb, {live:true,retry:true})
	.on('error', function (err) {
		console.log('Replication error: '+err);
		alert('Replication error: '+err);
	}).on('active', function () {
		notifier.show("Active Replication...");
		console.log("Active Replication...");
	}).on('paused', function (err) {
		notifier.show("Replication paused: "+err);
		console.log("Replication paused: "+err);
	});
	var queryobj = buildQueryObject(config.editlayer, bbox);
	loadFromCloudantQuery(queryobj, editdb, editlayer);
}

// get all data layers from Cloudant
function loadData() {
	document.getElementById('editbutton').disabled = false;
	// TODO: improvement, move this into a webworker

	var bbox = map.getBounds().toBBoxString();
	for (var i = 0; i < remotedbs.length; i++) {
		loadLayer(i, bbox);
	}
	// get editable layer
	loadEditableLayer(bbox);
} // end function loadData

function buildQueryObject(layerconfig, bbox) {
	var q = 'https://';
	// if (layerconfig.key) q += layerconfig.key + ':' + layerconfig.password + '@';
	q += layerconfig.account + '/' + layerconfig.name + '/' + layerconfig.geopath;
	q += '?include_docs=true&limit=200&bbox=' + bbox;
	var qo = { url: q, contentType: 'application/json' };
	if (layerconfig.key && layerconfig.password) {
		qo.username = layerconfig.key;
		qo.password = layerconfig.password;
	}
	return qo;
}
