var test   = require('tape');
// we display the file (name) in each test name
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

/************************ SETUP HAPI SERVER ***************************/
var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// var Joi = require('joi');
// var custom_fields = {
//   email     : Joi.string().email().required()
// }
// function email_handler (request, reply) {
//   console.log(request.payload)
//   reply('test passed');
// }
// var opts = { fields: custom_fields, handler: email_handler };

// load the plugin
server.register([{ register: require('../lib') }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

/************************* TESTS ***************************/
test(file+"No fields defined - expect 404 (i.e. no /register route!)", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : { email: 'invalidemail' } // no tld
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 404, "/register not found (as expected)");
    server.stop(function(){ t.end() });
  });
});


/************************* SERVER TWO **********************/

var server2 = new Hapi.Server({ debug: false })
server2.connection({ port: 8000 });

var Joi = require('joi');
var custom_fields = {
  email     : Joi.string().email().required()
}
// function email_handler (request, reply) {
//   console.log(request.payload)
//   reply('test passed');
// }
var opts = { fields: custom_fields };

// load the plugin
server2.register([{ register: require('../lib'), options:opts  }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

/************************* TESTS ***************************/
test(file+"No handler - expect 404 (i.e. no /register route!)", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : { email: 'invalidemail' } // no tld
  };

  server2.inject(options, function(response) {
    t.equal(response.statusCode, 404, "/register not found (as expected)");
    server2.stop(function(){ t.end() });
  });
});
