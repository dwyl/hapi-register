var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection();

// load one plugin
server.register(require('../lib'), function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }

});
