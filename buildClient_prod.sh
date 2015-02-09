#!/bin/sh

cd clients

echo 'install npm'
npm install

echo 'build youtube_producer client'
npm run build-youtube-producer

#here add another client

cd ..
