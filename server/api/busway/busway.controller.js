 'use strict';

 var _ = require('lodash');


 var request = require('request');

console.log ('loading');

var mappings = [
  {id: '7932', name: 'Route 101 to Hartford/New Britain'},
  {id: '7933', name: 'Route 102 to Hartford/New Britain and Bristol'},
  {id: '7934', name: 'Route 121 to Hartford/MCC/UConn Health'},
  {id: '7935', name: 'Route 128 to Hartford/Westfarms Mall/New Britain'},
  {id: '7936', name: 'Route 140 to CCSU'},
  {id: '7937', name: 'Route 144 to Westfarms/Wethersfield'},
  {id: '7938', name: 'Route 153 to Flatbush/Copaco Shopping Center'},
  {id: '7939', name: 'Route 161 to St. Francis Hospital/Hartford Hospital'},
  {id: '7995', name: 'Route 928 to Hartford/Waterbury'},
  {id: '7679', name: 'Route 101 to Hartford/New Britain'},
  {id: '7680', name: 'Route 102 to Hartford/New Britain and Bristol'},
  {id: '7681', name: 'Route 121 to Hartford/MCC/UConn Health'},
  {id: '7682', name: 'Route 128 to Hartford/Westfarms Mall/New Britain'},
  {id: '7683', name: 'Route 140 to CCSU'},
  {id: '7684', name: 'Route 144 to Westfarms/Wethersfield'},
  {id: '7685', name: 'Route 153 to Flatbush/Copaco Shopping Center'},
  {id: '7686', name: 'Route 161 to St. Francis Hospital/Hartford Hospital'},
  {id: '7742', name: 'Route 928 to Hartford/Waterbury'},
  {id: '7687', name: 'CTTransit Route 30/Bradley Flyer'},
  {id: '7691', name: 'CTTransit Route 31'},
  {id: '7689', name: 'CTTransit Route 32'},
  {id: '7688', name: 'CTTransit Route 33'},
  {id: '7694', name: 'CTTransit Route 41'},
  {id: '7693', name: 'CTTransit Route 42'},
  {id: '7698', name: 'CTTransit Route 46'},
  {id: '7700', name: 'CTTransit Route 50'},
  {id: '7701', name: 'CTTransit Route 53'},
  {id: '7703', name: 'CTTransit Route 56'},
  {id: '7705', name: 'CTTransit Route 60'},
  {id: '7706', name: 'CTTransit Route 61'},
  {id: '7707', name: 'CTTransit Route 63'},
  {id: '7709', name: 'CTTransit Route 69'},
  {id: '7712', name: 'CTTransit Route 76'},
  {id: '7752', name: 'CTTransit Route 82'},
  {id: '7715', name: 'CTTransit Route 83'},
  {id: '7753', name: 'CTTransit Route 88'},
  {id: '7727', name: 'CTTransit Route 91'},
  {id: '7735', name: 'CTTransit Route 92'},
  {id: '7754', name: 'CTTransit Route 95'},
  {id: '7702', name: 'Out of service/layover'}

];



function mapRouteId(routeId) {
  var routeString = 'Route Id ' + routeId;

  var temp = _.find(mappings, function(item){
    return item.id === routeId;
  });

  if (temp) {
    routeString = temp.name
  }
  return routeString
}

// Get list of things
exports.index = function(req, res) {
  if (req.query) {
    var userLat = req.query.userLat;
    var userLong = req.query.userLong;
  }

  request('http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json', function (error, response, body) {

    if(error){
      return console.log('Error:', error);
    }

    if(response.statusCode !== 200){
      return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    var data = JSON.parse(body);
    
    var kmlData = '<?xml version="1.0" encoding="utf-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>';

    kmlData += '<Style id="green"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff00ff00</color><scale>0.7</scale></IconStyle></Style>';
    kmlData += '<Style id="red"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ffff0000</color><scale>0.7</scale></IconStyle></Style>';
    kmlData += '<Style id="blue"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff0000ff</color><scale>0.7</scale></IconStyle></Style>';
    kmlData += '<Style id="white"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ffffffff</color><scale>0.7</scale></IconStyle></Style>';
    kmlData += '<Style id="small"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff00ff00</color><scale>0.8</scale></IconStyle></Style>';
    kmlData += '<Style id="medium"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff00ff00</color><scale>1.0</scale></IconStyle></Style>';
    kmlData += '<Style id="large"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff00ff00</color><scale>1.2</scale></IconStyle></Style>';
    kmlData += '<Style id="other"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ff00ff00</color><scale>1.0</scale></IconStyle></Style>';
    kmlData += '<Style id="coach"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/shapes/bus.png</href></Icon><color>ffff0000</color><scale>1.2</scale></IconStyle></Style>';
  
    _.each(data.entity, function(item) {
      var lat = item.vehicle.position.latitude;
      var lon = item.vehicle.position.longitude;
      var routeId = item.vehicle.trip.route_id;
      var id = item.id;

      var color = 'blue';

      if (/A\d+/.test(id)) {
        color = 'coach';
      } else if (id > 1461 && id < 1474) {
        color = 'large';
      } else if (id > 1440 && id < 1460) {
        color = 'medium';
      } else if ((id > 1429 && id < 1439) || id === 1501 || id === 1502 || id === 1503) {
        color = 'small';
      } else if ((id > 1474 && id < 1481) || (id > 1509 && id < 1526)) {
        color = 'coach';
      } else {
        color = 'other';
      }

      kmlData += '<Placemark><name>Bus ' + id + '</name><styleUrl>#' + color + '</styleUrl><description>' + mapRouteId(routeId) + '</description><Point><coordinates>' + lon + ',' + lat + '</coordinates></Point></Placemark>';
    });

    if (userLong && userLat) {
      kmlData += '<Placemark><Point><coordinates>' + userLong + ',' + userLat + '</coordinates></Point></Placemark>';
    }

    kmlData += '</Document></kml>';

    res.set('Content-Type', 'application/vnd.google-earth.kml+xml');
    
    res.send(kmlData);

  });
};
