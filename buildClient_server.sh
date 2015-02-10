#!/bin/sh

cd clients

echo 'install npm'
npm install

echo 'test youtube_producer client'
npm run test-youtube-producer

echo 'build youtube_producer client'
npm run build-youtube-producer

cd ..
