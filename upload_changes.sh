# Killing node process
pid=$(forever list | grep build/index.js | cut -c137-141) && sudo kill $pid
node=$(lsof -n -i :8080 | grep LISTEN | cut -c9-13) && sudo kill $node

# Starting node process
forever start build/index.js