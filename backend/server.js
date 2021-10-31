require("dotenv").config();
//require("../frontend/static");
const express = require("express");
const { createServer } = require("http");
const socketIo = require("socket.io");
var SSHClient = require("ssh2").Client;
var serveStatic = require("serve-static");

const port = process.env.PORT || 80;
console.log("PORT: " + port);
const app = express();
app.use(serveStatic("./frontend/"));
const httpServer = createServer(app);
httpServer.listen(port);

const io = socketIo(httpServer, {
  cors: {
    origin: ["https://kozohorsky.xyz", "https://kozohorsky-xyz.herokuapp.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("hostname", (opt) => {
    console.log(opt);
    var conn = new SSHClient();
    conn
      .on("ready", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        conn.shell({ term: "xterm-256color" }, function (err, stream) {
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
              socket.emit(
                "data",
                decodeURIComponent(escape(d.toString("binary")))
              );
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
        host: "0.tcp.eu.ngrok.io",
        port: 16144,
        password: opt.pswd,
        username: opt.usr,
      });
  });
});

//require("./client");
