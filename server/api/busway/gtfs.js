var _ = require('lodash');

var fs = require('fs');

var unzip = require('unzip');

var http = require('http');

var url = 'http://www.cttransit.com/uploads_GTFS/googleha_transit.zip';

var routeData = {};

exports.load = function(callback) {

  if (routeData) {
    for(var prop in routeData) {
      if (routeData.hasOwnProperty(prop)) {
        callback(routeData);
        return;
      }
    }
  }

  var routes, trips;

    var req = http.get(url, function(res) {
    res.pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type;
      var size = entry.size;
      if (fileName === 'routes.txt' || fileName === 'trips.txt') {
        entry.pipe(fs.createWriteStream('/tmp/' + fileName));
      } else {
        entry.autodrain();
      }
    })
    .on('close', function() {
      fs.readFile('/tmp/routes.txt', function (err, data) {
        if (err) throw err;
          data = '' + data;
          routes = data.split('\n');

          routes.splice(0,1);

          fs.readFile('/tmp/trips.txt', function (err, data) {
            if (err) throw err;
            data = '' + data;


            trips = data.split('\n');

            trips.splice(0,1);

            var temp;
            for (var i=0;i<routes.length;i++) {
              temp = routes[i].split(',');
              if (temp[0]) {
                routeData[temp[0]] = {
                  routeId: temp[0],
                  routeName: temp[2],
                  routeColor: temp[7]
                };
              }
            }

            var tripData = {};
            for (i=0;i<trips.length;i++) {
              temp = trips[i].split(',');
              if (temp[0]) {
                if (routeData[temp[0]] && !routeData[temp[0]].displayName) {
                  routeData[temp[0]].displayName = temp[3];
                }
              }
            }

            callback(routeData);

          });
      });
    });
  });
}
