"""Stone Age Upgrade — in-house synthesized sound effects (100% original, no samples, no licence needed).
python3 sfx.py <outdir>  → writes 48 kHz mono WAVs."""
import sys, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
t_ = lambda d: np.arange(int(SR * d)) / SR
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def env(n, a, d, curve=4):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-curve * np.linspace(0, 1, n - na)) if n > na else 1
    return e
def verb(x, size=.6, mix=.25):
    ir = rng.standard_normal(int(SR * size)) * np.exp(-6 * np.linspace(0, 1, int(SR * size)))
    w = np.convolve(x, ir) * .02
    y = np.concatenate([x, np.zeros(len(w) - len(x))])
    return y * (1 - mix) + w * mix
def save(name, x, peak=.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    wavfile.write(os.path.join(out, name + '.wav'), SR, (x * 32767).astype(np.int16))

# whoosh: swept band-passed noise
def whoosh(d=.55, f0=300, f1=3000):
    n = int(SR * d); x = rng.standard_normal(n); y = np.zeros(n); seg = 256
    for i in range(0, n, seg):
        k = i / n; f = f0 + (f1 - f0) * np.sin(k * np.pi) ** 1.5
        y[i:i + seg] = bp(x[i:i + seg] if i == 0 else x[max(0, i - 512):i + seg], max(60, f * .6), min(20000, f * 1.6))[-len(x[i:i + seg]):]
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2
save('whoosh', whoosh())
save('whoosh_short', whoosh(.3, 500, 4000))
save('whoosh_rev', whoosh(.7, 2500, 200)[::-1] * np.linspace(.3, 1, int(SR * .7)))
# pop
t = t_(.12); f = 500 + 900 * np.exp(-t * 40)
save('pop', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .002, .1, 8), .6)
# tick (counter)
t = t_(.03); save('tick', hp(rng.standard_normal(len(t)), 3000) * env(len(t), .0005, .03, 12), .35)
# ding (bell)
t = t_(1.4); x = sum(a * np.sin(2 * np.pi * 1320 * r * t) * np.exp(-t * dcy) for a, r, dcy in [(1, 1, 3), (.5, 2.76, 5), (.3, 5.4, 8), (.2, 8.9, 10)])
save('ding', verb(x * env(len(t), .002, 1.4, 2), .5, .15), .55)
# success chime (two notes up)
t = t_(.9); n1 = np.sin(2 * np.pi * 1046 * t) * np.exp(-t * 4); n2 = np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 4)
x = np.concatenate([n1[:int(SR * .14)], np.zeros(0)]); x = np.concatenate([x, n2]); save('chime', verb(x, .5, .2), .55)
# notification (two quick tones)
t = t_(.1); a = np.sin(2 * np.pi * 988 * t) * env(len(t), .002, .1, 5); b = np.sin(2 * np.pi * 1319 * t_(.25)) * env(int(SR * .25), .002, .25, 5)
save('notify', np.concatenate([a, np.zeros(int(SR * .03)), b]), .55)
# error buzz
t = t_(.35); save('error', lp(np.sign(np.sin(2 * np.pi * 120 * t)) * env(len(t), .005, .35, 3), 1800), .5)
# boom (vine-boom style deep hit with tail)
t = t_(2.2); f = 90 * np.exp(-t * 2.2) + 38; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.0)
x += lp(rng.standard_normal(len(t)), 400) * np.exp(-t * 18) * .8
save('boom', verb(x, 1.2, .3), .95)
# stamp / thud
t = t_(.45); x = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 10) + 50) / SR) * np.exp(-t * 9) + bp(rng.standard_normal(len(t)), 800, 3000) * np.exp(-t * 40) * .6
save('stamp', x, .9)
# explosion (big)
t = t_(2.5); x = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 2.5) + np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 3) + 30) / SR) * np.exp(-t * 2)
save('explosion', verb(x * env(len(t), .003, 2.5, 1), .8, .3), .95)
# boing (spring)
t = t_(.6); f = 260 + 140 * np.sin(2 * np.pi * 18 * t) * np.exp(-t * 4); save('boing', np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5), .6)
# typing burst (2 s of key clicks)
d = 2.0; x = np.zeros(int(SR * d)); tt = 0.
while tt < d - .05:
    i = int(tt * SR); k = hp(rng.standard_normal(int(SR * .025)), 1500) * np.exp(-np.linspace(0, 8, int(SR * .025)))
    x[i:i + len(k)] += k * (.6 + .4 * rng.random()); tt += .07 + rng.random() * .09
save('typing', x, .45)
# crickets (awkward silence)
t = t_(2.2); chirp = (np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 30 * t) > .2) * ((t * 2.2) % 1 < .35))
save('crickets', chirp * .6 + .02 * rng.standard_normal(len(t)), .35)
# record scratch (rewind)
t = t_(.55); f = 600 + 500 * np.sin(2 * np.pi * 9 * t); save('scratch', bp(rng.standard_normal(len(t)), 300, 3500) * np.abs(np.sin(2 * np.pi * np.cumsum(f) / SR / 40)) * env(len(t), .01, .55, 2), .6)
# glitch (flash to TODAY?)
t = t_(.35); x = np.round(rng.standard_normal(len(t)) * 3) / 3 * (rng.random(len(t)) > .6); save('glitch', hp(x, 800) * env(len(t), .001, .35, 3), .5)
# riser
t = t_(1.6); f = 200 + 1800 * (t / 1.6) ** 2; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 + bp(rng.standard_normal(len(t)), 1000, 8000) * (t / 1.6) * .6
save('riser', x * (t / 1.6) ** 1.5, .5)
# power down (battery drain)
t = t_(2.6); f = 900 * np.exp(-t * 1.2) + 80; save('powerdown', lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 2500) * env(len(t), .02, 2.6, 1.5), .45)
# crack (screen)
t = t_(.3); save('crack', hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 25), .6)
# pen scribble
t = t_(.6); save('scribble', bp(rng.standard_normal(len(t)), 1500, 6000) * (np.abs(np.sin(2 * np.pi * 7 * t)) ** 2) * env(len(t), .01, .6, 1), .35)
# chomp (bite)
x = np.concatenate([lp(rng.standard_normal(int(SR * .06)), 2500) * np.exp(-np.linspace(0, 6, int(SR * .06))), np.zeros(int(SR * .08))] * 2); save('chomp', x, .6)
# buzz (bees) 3 s
t = t_(3.0); f = 230 + 12 * np.sin(2 * np.pi * 5 * t) + 8 * np.sin(2 * np.pi * 13 * t); saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
save('bees', bp(saw, 200, 3000) * (.6 + .4 * np.sin(2 * np.pi * .7 * t)) * env(len(t), .2, 3, .3), .4)
# wind / blow
t = t_(1.8); save('blow', bp(rng.standard_normal(len(t)), 300, 1800) * np.sin(np.linspace(0, np.pi, len(t))), .4)
# electric zap
t = t_(.7); save('zap', hp(np.sign(np.sin(2 * np.pi * 60 * t)) * rng.random(len(t)), 500) * env(len(t), .002, .7, 3), .5)
# rocket rumble
t = t_(3.5); save('rocket', lp(rng.standard_normal(len(t)), 600) * np.minimum(1, t * 2) * (1 - (t / 3.5) ** 3), .7)
# boot beep
t = t_(.4); save('beep', np.sin(2 * np.pi * 880 * t) * (t < .12) + np.sin(2 * np.pi * 1320 * t) * (t > .18) * (t < .32), .4)
# drone (serious moments) 14 s
t = t_(14); x = sum(np.sin(2 * np.pi * f * t + p) for f, p in [(55, 0), (82.4, 1), (110.2, 2)]) * (.5 + .5 * np.sin(2 * np.pi * .1 * t)); save('drone', lp(x, 400) * env(len(t), 2, 14, .5), .4)
# ambience: night campfire (20 s loop) — low rumble + crackles + faint crickets
d = 20; t = t_(d); x = lp(rng.standard_normal(len(t)), 250) * .25
for _ in range(220):
    i = int(rng.random() * (len(t) - 2000)); k = hp(rng.standard_normal(600), 1500) * np.exp(-np.linspace(0, 10, 600)) * (.3 + rng.random())
    x[i:i + 600] += k
x += np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 28 * t) > .4) * ((t * 1.3) % 1 < .25) * .05
save('amb_night', x, .5)
# ambience: day savanna (20 s) — wind + far birds
x = bp(rng.standard_normal(len(t)), 200, 1200) * (.6 + .4 * np.sin(2 * np.pi * .15 * t)) * .5
for _ in range(14):
    s0 = rng.random() * (d - 1); i = int(s0 * SR); tb = t_(.25); fb = 2500 + 900 * np.sin(2 * np.pi * 14 * tb)
    x[i:i + len(tb)] += np.sin(2 * np.pi * np.cumsum(fb) / SR) * np.exp(-tb * 10) * .25
save('amb_day', x, .4)

# ================= EP02 car pack (synth) =================
def engine(f, d, rough=.35):  # f: array of firing freq (Hz) per sample
    ph = np.cumsum(f) / SR; x = np.sign(np.sin(2 * np.pi * ph)) * .5 + np.sin(2 * np.pi * ph * .5) * .6
    x += rough * lp(rng.standard_normal(len(f)), 400) * (1 + np.sin(2 * np.pi * ph * .25))
    return lp(x, 900)
# engine start: starter crank (3 chugs) + catch + idle
t = t_(.9); crank = engine(14 + 0 * t, .9, .6) * (.5 + .5 * np.sin(2 * np.pi * 4.5 * t))
t2 = t_(1.8); f2 = 30 + 40 * np.exp(-t2 * 3) * (t2 > .05) + 8 * np.sin(2 * np.pi * 1.3 * t2)
save('engine_start', np.concatenate([crank * .6, engine(f2, 1.8) * env(len(t2), .03, 1.8, .8)]), .7)
# rev (vroom)
t = t_(1.4); f = 30 + 110 * np.sin(np.pi * np.minimum(t / 1.2, 1)) ** 1.2
save('vroom', engine(f, 1.4) * env(len(t), .05, 1.4, 1.2), .75)
# idle loop 6 s (seamless-ish)
t = t_(6); f = 28 + 2 * np.sin(2 * np.pi * .7 * t); save('amb_engine', engine(f, 6, .2), .45)
# pass-by (doppler)
t = t_(2.0); f = 70 + 30 * np.tanh((1 - t) * 4); a = 1 / (1 + ((t - 1) * 3) ** 2)
save('passby', engine(f, 2.0) * a, .7)
# horn: two detuned square-ish tones
def horn(d):
    t = t_(d); x = sum(np.sign(np.sin(2 * np.pi * fq * t)) * .5 for fq in (392, 494)); x = bp(x, 250, 3000)
    e = np.ones(len(t)); na = int(.015 * SR); e[:na] = np.linspace(0, 1, na); e[-na:] = np.linspace(1, 0, na); return x * e
save('honk', horn(.28), .6)
save('honk_long', horn(1.6), .6)
# tire skid
t = t_(.9); save('skid', bp(rng.standard_normal(len(t)), 1800, 4200) * (1 + .3 * np.sin(2 * np.pi * 37 * t)) * env(len(t), .03, .9, 1.5), .5)
# crash: thud + metal clank
t = t_(.8); thud = lp(rng.standard_normal(len(t)), 180) * np.exp(-t * 9)
clank = sum(np.sin(2 * np.pi * fq * t) * np.exp(-t * dk) for fq, dk in ((523, 6), (1180, 9), (1870, 12))) * .3
save('crash', thud * 1.4 + clank + hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 18) * .4, .8)
# bonk (cartoon)
t = t_(.35); f = 260 * np.exp(-t * 6) + 90; save('bonk', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .002, .35, 6), .7)
# steam puff
t = t_(.6); save('steam', hp(rng.standard_normal(len(t)), 2500) * env(len(t), .01, .6, 3), .4)
# ostrich squawk
t = t_(.35); f = 900 + 500 * np.sin(2 * np.pi * 11 * t); save('squawk', bp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 500, 3500) * env(len(t), .01, .35, 2), .5)
# mammoth trumpet
t = t_(1.2); f = 330 + 60 * np.sin(np.pi * t / 1.2); x = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2, 3, 4))
save('trumpet', bp(x, 200, 3000) * env(len(t), .08, 1.2, 1.5), .6)
# cash/ka-ching-ish (oil money) -> reuse ding; bird tweets
t = t_(.5); f = 3200 + 1200 * np.sin(2 * np.pi * 18 * t); save('tweet', np.sin(2 * np.pi * np.cumsum(f) / SR) * (np.sin(2 * np.pi * 8 * t) > 0) * env(len(t), .01, .5, 2), .35)
# seatbelt click
t = t_(.12); save('click', hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 80) + np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 60) * .4, .6)
print('ok', sorted(os.listdir(out)))
