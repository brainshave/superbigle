#!/bin/bash

cat <<EOF
<!DOCTYPE html>
<html>
  <head>
    <title>WebGL Bible</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <div id="put-canvas-here"></div>
    <ul id="menu"></ul>
EOF

function script_tag () {
  while read line; do
    echo '    <script type="text/javascript" src="'${line:2}'"></script>'
  done
}

find . -path "./lib/*.js" | script_tag
find . -path "./chapter_??/*.js" | script_tag

cat <<EOF
  </body>
</html>
EOF
