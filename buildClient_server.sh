#!/bin/sh

cd clients

echo 'install npm'
npm install

echo 'test youtube_producer client'
npm run test-youtube-producer-server

echo 'build youtube_producer client'
npm run build-youtube-producer

echo 'test youtube-viewer-level2-TV client'
npm run test-youtube-viewer-level2-tv-server

echo 'build youtube_viewer_level2_TV client'
npm run build-youtube-viewer-level2-tv

cd ..
