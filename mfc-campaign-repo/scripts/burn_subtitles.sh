#!/usr/bin/env bash
ffmpeg -y -i "$1" -vf "subtitles='$2'" -c:a copy "$3"
