#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  readonly hook_name="$(basename -- "$0")"
  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    . ~/.huskyrc
  fi
  readonly opt="set -e"
  sh -c "$opt" 2>/dev/null || opt="set -o errexit"
  eval "$opt"
fi
