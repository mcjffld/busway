 'use strict';

 var _ = require('lodash');


 var request = require('request');

console.log ('loading');

// Get list of things
exports.index = function(req, res) {

  console.log ('buswaayyyy');

  request('http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json', function (error, response, body) {
    //Check for error
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

      kmlData += '<Placemark><name>' + id + '</name><styleUrl>#' + color + '</styleUrl><description>Bus ' + id + '</description><Point><coordinates>' + lon + ',' + lat + '</coordinates></Point></Placemark>'
    });

    kmlData += '</Document></kml>';

    res.set('Content-Type', 'application/vnd.google-earth.kml+xml');
    
    res.send(kmlData);

  });
};
