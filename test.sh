#!/bin/bash

echo "Moving files"
rsync -r --exclude 'node_modules' * osu:~/tmp/

echo "Forwarding Port"
ssh -L 3805:127.0.0.1:3805 -N osu &

echo "Starting server"
ssh osu "bash -c 'cd tmp && npm install && npm start'"

echo ""
echo "Killing server"
ssh osu "killall -v -u padbergm node"

echo "Killing forward"
kill %%