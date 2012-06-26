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

function each_line () {
  while read line; do
    $* "${line:2}"
  done
}

function script_src () {
  echo '    <script type="text/javascript" src="'$1'"></script>'
}

function script_inline () {
  id=${2/.c/}
  id=${id/\//_}
  echo -e '    <script type="'$1'" id="'$id'">'
  cat $2
  echo -e '    </script>'
}

# load shaders inline
find . -path "./*/*.c" | sort | each_line script_inline text/x-c
find . -path "./lib/*.js" | sort | each_line script_src
find . -path "./chapter_??/*.js" | sort | each_line script_src

cat <<EOF
  </body>
</html>
EOF
