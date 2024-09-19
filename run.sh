#!/bin/bash

docker run ppclient:dev -d

cd ./Electron
npm i

electron .
