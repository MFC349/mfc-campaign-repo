#!/usr/bin/env bash
set -e
echo "Attempting FFmpeg install..."
UNAME=$(uname -s)
case "$UNAME" in
  Darwin)
    if ! command -v brew >/dev/null 2>&1; then
      echo "Homebrew not found. Install from https://brew.sh and re-run."
      exit 1
    fi
    brew install ffmpeg
    ;;
  Linux)
    if command -v apt >/dev/null 2>&1; then
      sudo apt update && sudo apt install -y ffmpeg
    elif command -v yum >/dev/null 2>&1; then
      sudo yum install -y epel-release && sudo yum install -y ffmpeg
    else
      echo "Unknown package manager. Install FFmpeg manually."
      exit 1
    fi
    ;;
  *)
    echo "Unsupported OS. Install FFmpeg manually."
    exit 1
    ;;
esac
echo "FFmpeg installed."
