var Joi    = require('joi');
 // default fields
var fields = { email : Joi.string().email().required() };

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
  // console.log(' - - - - - - - - - - - - - - - FIELDS')
  // console.log(options.fields);
  // console.log(' - - - - - - - - - - - - - - - ')
  if(options.fields) {
    fields = options.fields
  }
  var handler;
  if(options.handler){
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
      handler: default_handler
  });

  next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
