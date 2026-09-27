#!/usr/bin/env bash
# Master the narration and mix it over a music bed that ducks under the voice.
#   video/tools/mix.sh ch01 assets/bgm-hazelwood.mp3 [assets/voice-ref.wav]
# With a third argument, the voice's EQ is matched to that recording's tonal balance (bass / mids / treble), measured
# on the fully processed voice and refined until every band is within 1 dB (tools/voicematch.py).
# Writes video/build/<ch>/voice-master.wav (the mastered narration alone) and video/build/<ch>/mix.m4a,
# both exactly as long as the narration track (lead-in and tail included).
#
# Voice master: gain to -23 LUFS · high-pass 90 Hz · EQ (matched, or a generic mud cut + presence lift) ·
# fast soft-knee peak control (6:1) · gentle 2:1 levelling · de-ess · static gain to -16 LUFS · limiter at -1.5 dBFS (spoken-word web/YouTube). Gain and EQ are
# solved together on the finished signal, so the limiter can't skew the tonal balance or the loudness.
set -euo pipefail
ch=$1; bed=$2; match=${3:-}
root=$(cd "$(dirname "$0")/../.." && pwd); out="$root/video/build/$ch"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/voice.wav")
bdur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$bed")

# pass 0: bring the raw take to about -23 LUFS so the compressor and limiter see a sensible level
raw_i=$(ffmpeg -hide_banner -nostats -i "$out/voice.wav" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import json,sys; print(json.load(sys.stdin)['input_i'])")
g0=$(python3 -c "print(round(-23 - float('$raw_i'), 2))")
eq="equalizer=f=280:t=q:w=1.2:g=-2.5,equalizer=f=3800:t=q:w=1.4:g=2"   # generic voice curve (used without a match)
dyn="acompressor=threshold=-16dB:ratio=6:attack=0.5:release=40:knee=6,acompressor=threshold=-24dB:ratio=2:attack=20:release=250:makeup=2,deesser=i=0.3"
base="aresample=48000,volume=${g0}dB,highpass=f=90:p=2"
if [ -n "$match" ]; then
  # EQ matched to the reference recording, and the output gain, both found on the finished signal
  chain="$base,$(python3 "$root/video/tools/voicematch.py" "$match" "$out/voice.wav" "$base" "$dyn" -16 | tail -1)"
  echo "  matched chain: ${chain#$base,}"
else
  m=$(ffmpeg -hide_banner -nostats -i "$out/voice.wav" -af "$base,$eq,$dyn,ebur128" -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  chain="$base,$eq,$dyn,volume=$(python3 -c "print(round(-16 - float('$m'), 2))")dB,alimiter=limit=0.84:attack=4:release=100:level=false"
fi
echo "$chain" > "$out/voice-chain.txt"   # the exact mastering chain, for the record
ffmpeg -v error -y -i "$out/voice.wav" -af "$chain,aresample=48000" -c:a pcm_s24le "$out/voice-master.wav"

# stretch the bed to the video's length if it's within 8%; a longer bed is trimmed and faded out instead
tempo=$(python3 -c "r=$bdur/$dur; print(r if 0.92 <= r <= 1.08 else 1.0)")
fade_out=$(python3 -c "print(max(0, $dur - 3.5))")
ffmpeg -v error -y -i "$out/voice-master.wav" -i "$bed" -filter_complex "
  [0:a]asplit=2[v][key];
  [1:a]aresample=48000,atempo=$tempo,atrim=0:$dur,loudnorm=I=-30:TP=-6:LRA=11,
       afade=t=in:d=1.2,afade=t=out:st=$fade_out:d=3.5[m];
  [m]apad[mp];[mp][key]sidechaincompress=threshold=0.015:ratio=10:attack=30:release=800:makeup=1[md];
  [v][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=false[mix]" \
  -map "[mix]" -c:a aac -b:a 192k -t "$dur" "$out/mix.m4a"
printf '%s  (%.1fs, bed tempo %s)\n' "$out/mix.m4a" "$dur" "$tempo"
[ -n "$match" ] && python3 "$root/video/tools/tonal.py" "$match" "$out/voice-master.wav" | sed 's/^/  /'
ffmpeg -hide_banner -nostats -i "$out/voice-master.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | sed 's/^/  voice /'
ffmpeg -hide_banner -nostats -i "$out/mix.m4a" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | sed 's/^/  mix /'
