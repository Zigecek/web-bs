require("dotenv").config();
require("./utils/mongoose").init();
var hostnamePort;
var host;
var hostPort;

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
    origin: [
      "https://kozohorsky.xyz",
      "https://kozohorsky-xyz.herokuapp.com" /*"http://195.113.226.101"*/,
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("getZero", () => {
    require("./models/Config").findOne(
      {
        number: 1,
      },
      (err, Cres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
        socket.emit("takeZero", Cres.ngrokZeroUrl);
      }
    );
  });
  socket.on("getHost", () => {
    require("./models/Config").findOne(
      {
        number: 1,
      },
      (err, Cres) => {
        if (err) {
          console.error(err);
          error.sendError(err);
          return;
        }
        hostnamePort = Cres.ngrokRpiSSH;
        host = hostnamePort.match(/\d.tcp.eu.ngrok.io/)[0];
        hostPort = hostnamePort.match(/\d{4,6}/)[0];
        socket.emit("sendHost", { host: host, port: hostPort });
      }
    );
  });
  socket.on("hostname", (opt) => {
    var conn = new SSHClient();
    conn
      .on("ready", function () {
        socket.emit("conekt");
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        conn.shell({ term: "xterm-256color" }, function (err, stream) {
          if (err) {
            socket.emit("disconekt");
            return socket.emit(
              "data",
              "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
            );
          }
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
          conn.on("close", () => {
            stream.removeAllListeners("data");
          });
        });
      })
      .on("close", function () {
        socket.emit("disconekt");
        socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
        conn.removeAllListeners("ready");
        conn.end();
      })
      .on("error", function (err) {
        socket.emit(
          "data",
          "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
        );
        conn.end();
      })
      .connect({
        host: opt.host,
        port: Number(opt.port),
        password: opt.pswd,
        username: opt.usr,
      });
  });
});
