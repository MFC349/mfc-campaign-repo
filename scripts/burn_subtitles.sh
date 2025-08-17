#!/usr/bin/env bash
# Usage: ./scripts/burn_subtitles.sh input.mp4 subs.srt output.mp4
set -euo pipefail
if [ $# -lt 3 ]; then
  echo "Usage: $0 input.mp4 subs.srt output.mp4"
  exit 1
fi
ffmpeg -i "$1" -vf subtitles="$2" -c:a copy "$3"
