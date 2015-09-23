var Joi    = require('joi');
 // default fields
var default_fields = { email : Joi.string().email().required() };

/**
 * default handler
 */
function default_handler (request, reply) {
  console.log(request.payload)
  reply('test passed');
}

/**
 *
 */
exports.register = function (server, options, next) {
  var fields;
  if(options && options.fields) {
    fields = options.fields;
  } else {
    fields = default_fields;
  }
  var handler;
  if(options && options.handler){
    handler = options.handler;
  }
  else {
    handler = default_handler;
  }
  // expose /register route for any app that includes this plugin
  server.route({
      method: '*',
      path: '/register',
      config: {
        validate: { payload : fields }
      },
      handler: handler
  });

  next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
