var config = {
	geodata: [
		// { name: 'poinames', account: 'rajsingh.cloudant.com',
		// 	geopath: '_design/geodd/_geo/geoidx', type: 'Point',
		// 	style: {radius: 12, fillColor: '#6157B9', fillOpacity: 0.2, color: '#6157B9'} },
		{ name: 'hydro100k_arc', account: 'opendata.cloudant.com', 
			geopath: '_design/SpatialView/_geo/spatial', type: 'LineString', 
			style: {width: 4, fillOpacity: 0.6, color: '#12109B'} },
		// { name: 'boston_parcels', account: 'opendata.cloudant.com',
		// 	geopath: '_design/SpatialView/_geo/spatial', type: 'Polygon',
		// 	style: {width: 2, fillColor: '#FFAE00', fillOpacity: 0.4, color: '#FFAE00'} },
		{ name: 'boston_buildings', account: 'opendata.cloudant.com', 
			geopath: '_design/SpatialView/_geo/spatial', type: 'Polygon', 
			style: {width: 1, color: '#9B6D10'} },
		{ name: 'mbtabusroutes', account: 'opendata.cloudant.com', 
			geopath: '_design/SpatialView/_geo/spatial', type: 'LineString', 
			style: {width: 2, fillOpacity: 0.9, color: '#C42323'} }
	],
	editlayer: {
		name: 'fieldedits', 
		account: 'rajsingh.cloudant.com', 
		geopath: '_design/SpatialView/_geo/spatial', 
		type: 'GeometryCollection', 
		key: 'itselezvorgatterstiongen', 
		password: 'lQyjxkwFB2HN60oNce21VaRF', 
		style: {radius: 12, fillColor: '#ff0000', fillOpacity: 4, color: '#ff0000'}
	}
};