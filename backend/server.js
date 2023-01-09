const fs = require("fs");
const express = require("express");
const { createServer } = require("http");
const serveStatic = require("serve-static");

const port = process.env.PORT || 80;
const app = express();
const privateKey = fs.readFileSync("/etc/letsencrypt/live/kozohorsky.xyz/privkey.pem");
const certificate = fs.readFileSync("/etc/letsencrypt/live/kozohorsky.xyz/fullchain.pem");

console.log("PORT: " + port);
app.use(serveStatic("./frontend/"));

createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
).listen(port);
