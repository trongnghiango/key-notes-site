#!/bin/sh

SOURCE="/home/ka/Documents/00-notes/zettelkasten/Publish/"
DESTINATION="/home/ka/github.com/trongnghiango/notes-site/content/posts"

#rsync -avu "$SOURCE" "$DESTINATION"

while inotifywait -r -e modify,create,delete,move "$SOURCE"; do
    rsync -avz "$SOURCE" "$DESTINATION"
done