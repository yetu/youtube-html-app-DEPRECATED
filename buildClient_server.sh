#!/bin/sh

cd clients

echo 'install npm'
npm install

echo 'test youtube_producer client'
npm run test-youtube-producer-server

echo 'build youtube_producer client'
npm run build-youtube-producer

#TODO: add tests here
echo 'build youtube_viewer_level2_TV client'
npm run build-youtube-viewer-level2-tv

cd ..
