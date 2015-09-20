exports.register = function (server, options, next) {
  // expose /register route for any app that includes this plugin
  server.route({
      method: '*',
      path: '/register',
      handler: function (request, reply) {
        console.log(options);
          console.log(request.payload)
          reply('test passed');
      }
  });

  next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
