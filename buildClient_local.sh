cd clients

echo 'npm install'
npm install

echo 'test youtube_producer client'
npm run test-youtube-producer-local &

echo 'watch youtube_producer client'
npm run watch-youtube-producer &

#TODO: add tests here

echo 'watch youtube_viewer_level2_TV client'
npm run watch-youtube-viewer-level2-tv


