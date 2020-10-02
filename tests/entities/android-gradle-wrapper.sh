#!/bin/sh

VER="6.1.1"
while getopts "v" o;do
  case "$o" in
    v) VER=o;;
    *);;
  esac
done
cd /opt/app || exit 1
if ! [ -f gradlew ]; then
  gradle wrapper --gradle-version $VER
fi
