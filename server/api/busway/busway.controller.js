'use strict';

var _ = require('lodash');

var request = require('request');

var gtfs = require('./gtfs');

exports.index = function(req, res) {
  if (req.query) {
    var userLat = req.query.userLat;
    var userLong = req.query.userLong;
  }

  request('http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json', function (error, response, body) {

    if(error){
      res.json({ 'error': error});
      return;
    }

    if(response.statusCode !== 200) {
      res.json({ 'error': 'Invalid Status Code Returned:' + response.statusCode});
      return;
    }

    var data = JSON.parse(body);

    var kmlData = '<?xml version="1.0" encoding="utf-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>';

    gtfs.load(function(gtfsData) {
      _.each(gtfsData, function(item) {
        kmlData += '<Style id="' + item.routeId +'"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff' +item.routeColor+ '</color></IconStyle></Style>';
      });

      _.each(data.entity, function(item) {
        var lat = item.vehicle.position.latitude;
        var lon = item.vehicle.position.longitude;
        var routeId = item.vehicle.trip.route_id;
        var id = item.id;

        var routeData = gtfsData[routeId];

        kmlData += '<Placemark><name>Route ' + routeData.routeName + ' Bus ' + id + '</name><styleUrl>#' + routeId + '</styleUrl><description><![CDATA[' + routeData.displayName + ']]></description><Point><coordinates>' + lon + ',' + lat + '</coordinates></Point></Placemark>';
      });

      if (userLong && userLat) {
        kmlData += '<Placemark><Point><coordinates>' + userLong + ',' + userLat + '</coordinates></Point></Placemark>';
      }

      kmlData += '</Document></kml>';

      res.set('Content-Type', 'application/vnd.google-earth.kml+xml');

      res.send(kmlData);
    });

  });
};
