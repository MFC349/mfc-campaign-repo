#!/usr/bin/env bash
# Usage: ./scripts/overlay_text.sh input.mp4 "Your Text" output.mp4
set -euo pipefail
if [ $# -lt 3 ]; then
  echo "Usage: $0 input.mp4 \"Your Text\" output.mp4"
  exit 1
fi
ffmpeg -i "$1" -vf "drawtext=text='$2':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.5:boxborderw=10" -c:a copy "$3"
