#!/bin/bash
cd ~/web-bs
git checkout .
git fetch
git pull
npm run install
npm run reload
chmod +x ~/web-bs/*.sh