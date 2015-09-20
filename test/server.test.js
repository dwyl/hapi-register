var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// define which fields we want to validate for
var Joi    = require('joi');
var fields = {

};
var opts   = {'test':'that'};

// load the plugin
server.register([{ register: require('../lib'), options:opts }], function (err) {
  if (err) {
    console.error('Failed to load plugin:', err);
  }
});


server.start(function() {
  console.log('Now Visit: ' + server.info.uri);
}); // uncomment this to run the server directly

module.exports = server;
