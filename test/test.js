var test   = require('tape');
var server = require('./server.test.js');

var email  = 'dwyl.test+auth_basic' +Math.random()+'@gmail.com';

var person = {
  "email"    : email,
  "password" : "PinkFluffyUnicorns"
}

test("request to GET / should not require session token", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : person
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Base URL Does not Require ");
    server.stop(function(){ t.end() });
  });
});
