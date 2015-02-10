cd clients

echo 'npm install'
npm install

echo 'test youtube_producer client'
npm run test-youtube-producer-local &

echo 'watch youtube_producer client'
npm run watch-youtube-producer

cd ..
