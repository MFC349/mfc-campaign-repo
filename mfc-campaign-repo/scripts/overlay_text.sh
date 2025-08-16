#!/usr/bin/env bash
ffmpeg -y -i "$1" -vf "drawtext=text='$2':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h*0.83" -c:a copy "$3"
