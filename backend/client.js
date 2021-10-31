const sckt = require("socket.io");
var io = sckt(3000);
var SSHClient = require("ssh2").Client;
require('dotenv').config();

io.on("connection", (socket) => {
  console.log(socket);
  io.on("hostname", (opt) => {
    var conn = new SSHClient();
    conn
      .on("ready", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        conn.shell(function (err, stream) {
          if (err)
            return socket.emit(
              "data",
              "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
            );
          socket.on("data", function (data) {
            stream.write(data);
          });
          stream
            .on("data", function (d) {
              socket.emit("data", d.toString("binary"));
            })
            .on("close", function () {
              conn.end();
            });
        });
      })
      .on("close", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
      })
      .on("error", function (err) {
        socket.emit(
          "data",
          "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
        );
      })
      .connect({
        host: '0.tcp.eu.ngrok.io',
        port: '16144',
        password: opt.pswd,
        username: opt.usr
      });
  });
});
