const fs = require("fs");
const express = require("express");
const { createServer } = require("https");
const serveStatic = require("serve-static");

const port = 443;
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
