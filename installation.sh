#!/bin/bash
npm install pm2@latest -g
npm run install
pm2 startup
npm run start
pm2 save
