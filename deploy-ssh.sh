#!/bin/bash

#ARGS: HOST USERNAME DIRECTORY PM2_ID
USERNAME="$1"
HOST="$2"
DEST_DIR="$3"
PM2_ID="$4"

echo "⌛ Syncing \"dist/\" directory to server ..."
rsync -vrah --progress --delete --exclude '.*' ./dist/ ${USERNAME}@${HOST}:${DEST_DIR}
if [ $? -eq 0 ]
then
  echo '✅ Sync ok.'
  if [ -z ${PM2_ID} ]
  then
    echo "⚠️ No PM2 id supplied, skipping."
  else
    echo '⌛ Restarting app via pm2 ...'
    ssh -o StrictHostKeyChecking=no -l ${USERNAME} ${HOST} "pm2 restart ${PM2_ID}"
  fi
else
  echo "❌ Sync error, exit."
  exit 1
fi

echo '✅ Done.'
exit 0
