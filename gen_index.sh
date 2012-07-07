#!/bin/bash

function each () {
  fn=$1
  shift
  for file in $*; do
    $fn "${file:2}"
  done
}

function indent () {
  for (( i=0; i<$1; i++)); do
    echo -n " "
  done
}

function str () {
  indent $1
  echo "'"$2"', "
}

files=$(find . -path "./chapter_??/*.js" | sort)

cat <<EOF
define([
EOF

each 'str 2' $files

cat <<EOF
], function () {
  var names = [
EOF

each 'str 4' $files

cat <<EOF
  ];
  var exports = {
    names: names
  };
  for (var i = 0; i < arguments.length; ++i) {
    exports[names[i]] = arguments[i];
  }

  return exports;
});
EOF
