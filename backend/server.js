const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const serveStatic = require("serve-static");

const app = express();
const privateKey = fs.readFileSync("/etc/letsencrypt/live/kozohorsky.xyz/privkey.pem", "utf-8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/kozohorsky.xyz/cert.pem", "utf-8");

console.log("PORT: " + port);
app.use(serveStatic("./frontend/"));

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  )
  .listen(443);

http.createServer(app).listen(80);
