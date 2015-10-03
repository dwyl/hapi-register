/**
 * register simply creates a /register POST route
 */
exports.register = function (server, options, next) {
  if(options && options.fields) {
    var fields = options.fields;
  }
  else {
    var msg = 'Please define your required/optional fields';
    console.log(msg)
    return next(msg);
  }
  if(options && options.handler){
    var handler = options.handler;
  }
  else {
    var msg = 'Please specify a /register handler. see: http://git.io/vctLR';
    console.log(msg)
    return next(msg);
  }
  // expose /register route for any app that includes this plugin
  server.route({
      method: '*',
      path: '/register',
      config: {
        validate: {
          payload : fields,
          failAction: options.fail_action_handler || 'error'
        }
      },
      handler: handler
  });

  next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
