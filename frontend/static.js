const port = process.env.PORT || 80;
var http = require("http");

var finalhandler = require("finalhandler");
var serveStatic = require("serve-static");

var serve = serveStatic("./frontend/");

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(port);
