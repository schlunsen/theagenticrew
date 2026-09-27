#!/usr/bin/env python3
"""Compare the tonal balance of two voice recordings, band by band (long-term average spectrum).

  video/tools/tonal.py <reference.wav> <voice.wav> [--eq]

Prints each band's level relative to the file's own 500 Hz–2 kHz level, and the difference (voice − reference).
With --eq, prints an ffmpeg equalizer chain that moves the voice toward the reference (each band capped at ±5 dB).
"""
import sys, subprocess, numpy as np
BANDS = [("sub", 60, 100), ("bass", 100, 250), ("low-mid", 250, 600), ("mid", 600, 2000), ("presence", 2000, 5000), ("brilliance", 5000, 9000), ("air", 9000, 11800)]
CENTRES = {"bass": 160, "low-mid": 400, "mid": 1100, "presence": 3200, "brilliance": 6800, "air": 11000}
SR = 32000

def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32)
    # keep only speech frames (drop silences), so gaps don't skew the average
    n = 1024; fr = x[: len(x) // n * n].reshape(-1, n); rms = np.sqrt((fr ** 2).mean(1) + 1e-12)
    return fr[rms > np.percentile(rms[rms > 1e-5], 40)]   # voiced frames only (same rule as voicematch.py)

def spectrum(frames):
    w = np.hanning(frames.shape[1]); P = (np.abs(np.fft.rfft(frames * w, axis=1)) ** 2).mean(0)
    f = np.fft.rfftfreq(frames.shape[1], 1 / SR)
    band = lambda a, b: 10 * np.log10(P[(f >= a) & (f < b)].mean() + 1e-20)
    ref = band(500, 2000)
    return {name: band(a, b) - ref for name, a, b in BANDS}

ref, voc = spectrum(load(sys.argv[1])), spectrum(load(sys.argv[2]))
print(f"{'band':<11}{'reference':>10}{'voice':>8}{'diff':>8}")
for name, *_ in BANDS: print(f"{name:<11}{ref[name]:>10.1f}{voc[name]:>8.1f}{voc[name] - ref[name]:>+8.1f}")
if "--eq" in sys.argv:
    eq = []
    for name, c in CENTRES.items():
        cap = 3 if name == "air" else 5            # don't chase air the voice doesn't have: it only lifts hiss
        g = float(np.clip(ref[name] - voc[name], -cap, cap))
        if abs(g) >= 0.75: eq.append(f"equalizer=f={c}:t=o:w=1.2:g={g:.1f}")
    print(",".join(eq) or "anull")
if "--gains" in sys.argv:   # machine-readable: band=gain (reference − voice)
    print(" ".join(f"{n}={ref[n] - voc[n]:.2f}" for n in CENTRES))
