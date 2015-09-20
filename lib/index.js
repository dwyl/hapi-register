var Joi    = require('joi');
var fields = { email : Joi.string().email().required() }; // default fields

/**
 *
 */
exports.register = function (server, options, next) {
  console.log(options);
  if(options.fields && options.fields.length > 0){
    fields = options.fields
  }
  // expose /register route for any app that includes this plugin
  server.route({
      method: '*',
      path: '/register',
      config: {
        validate: fields
      },
      handler: function (request, reply) {
        console.log(fields);
          console.log(request.payload)
          reply('test passed');
      }
  });

  next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
