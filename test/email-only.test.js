var test   = require('tape');
// we display the file (name) in each test name
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

/************************ SETUP HAPI SERVER ***************************/
var Hapi   = require('hapi');     // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// load the plugin WITHOUT any options (test defaults)
server.register({ register: require('../lib')}, function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

/************************* TESTS ***************************/
test(file+"Attempt to register with invalid email", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : { email: 'invalidemail' } // no tld
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 400, "Invalid email address fails");
    server.stop(function(){ t.end() });
  });
});

var person = {
  "email" : 'dwyl.test+register@gmail.com'
}

test(file+"register with email", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : person
  };

  server.inject(options, function(response) {
    // console.log(response)
    t.equal(response.statusCode, 200, "Register worked with email ONLY");
    server.stop(function(){ t.end() });
  });
});
