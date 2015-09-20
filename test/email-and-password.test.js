var test   = require('tape');
// we display the file (name) in each test name
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

/****************************** SETUP HAPI SERVER ************************/
var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// define which fields we want to validate for
var Joi    = require('joi');
var fields = {
  email     : Joi.string().email().required(),
  // firstname : Joi.string(),
  password  : Joi.string().required().min(6) // minimum length 6 characters
}
var opts   = {'test':'that', fields:fields};

// load the plugin with the specific fields we want to validate against
server.register([{ register: require('../lib'), options:opts }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

var person = {
  "email" : 'dwyl.test+auth_basic' +Math.random()+'@gmail.com',
  "password":"EverythingIsAwesome"
}

test(file+"register with email and password", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : person
  };

  server.inject(options, function(response) {
    // console.log(response)
    t.equal(response.statusCode, 200, "Register worked with email and password");
    server.stop(function(){ t.end() });
  });
});
