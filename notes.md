
### Source
``` sh
/home/ka/Documents/00-notes/zettelkasten/Publish
```


### Destination
``` sh
/home/ka/github.com/trongnghiango/notes-site/content/posts
```

``` sh
#!/bin/sh

SOURCE="/home/ka/Documents/00-notes/zettelkasten/Publish"
DESTINATION="/home/ka/github.com/trongnghiango/notes-site/content/posts"
rsync -avu --delete "$SOURCE" "$DESTINATION"
```