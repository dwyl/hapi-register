exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
            reply('test passed');
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
