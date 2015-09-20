var server = new Hapi.Server({ debug: false })
server.connection();

var api = server.select('api');

api.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('api index');
    }
});

// load one plugin
server.register(require('myplugin'), function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});

// load multiple plugins
server.register([require('myplugin'), require('yourplugin')], function (err) {
    if (err) {
        console.error('Failed to load a plugin:', err);
    }
});
