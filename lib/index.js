exports.register = function (server, options, next) {

    server.route({
        method: '*',
        path: '/register',
        handler: function (request, reply) {
            console.log(request.payload)
            reply('test passed');
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
