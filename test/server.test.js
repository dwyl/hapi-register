var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// load one plugin
server.register(require('../lib'), function (err) {
  if (err) {
    console.error('Failed to load plugin:', err);
  }
});


server.start(function() {
  console.log('Now Visit: ' + server.info.uri);
}); // uncomment this to run the server directly

module.exports = server;
