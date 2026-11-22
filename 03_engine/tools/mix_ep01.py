"""EP01 final audio mix: narration + music bed (ducked) + in-house SFX + ambience.
Writes /tmp/full/mix_raw.wav (48 kHz stereo float) and the segment timeline JSON."""
import json, subprocess, numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d

SR = 48000
ROOT = '/home/claude/stone-age-upgrade'
EP = ROOT + '/01_episodes/EP01_Claude'
LIB = ROOT + '/02_library/audio'
FPS = 30
SEGS = [('act1', 736), ('sting', 45), ('act2', 1680), ('act3', 5858), ('act4', 8283), ('act5', 3380), ('act6', 1223), ('end', 360)]
OFF = {}; acc = 0
for name, fr in SEGS: OFF[name] = acc / FPS; acc += fr
TOTAL = acc / FPS
N = int(TOTAL * SR) + SR

def load(path, stereo=False):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2' if stereo else '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32)
    return a.reshape(-1, 2) if stereo else a
db = lambda d: 10 ** (d / 20)

voice = np.zeros(N, np.float32)
for i in range(1, 7):
    a = load(f'{EP}/02_audio/ep01_perde{i}.mp3'); s = int(OFF[f'act{i}'] * SR); voice[s:s + len(a)] += a

# ---------- music cues: (track, seg, start, end, track_offset, gain_db, fade_in, fade_out) ----------
T = {k: f'{LIB}/music/KevinMacLeod_{k}.mp3' for k in ['Investigations', 'Monkeys_Spinning_Monkeys', 'Sneaky_Snitch', 'Fluffing_a_Duck', 'Cipher2', 'Wholesome']}
CUES = [
    ('Investigations', 'act1', 0.0, 23.0, 0, -6, 1.5, .4),          # hook: mystery; cut before PROBLEMS boom
    ('Sneaky_Snitch', 'act2', 0.3, 55.9, 0, -7, .3, 1.0),            # reality check: mischievous
    ('Monkeys_Spinning_Monkeys', 'act3', 0.0, 106.2, 0, -8, .5, 1.5),  # day one comedy
    ('Monkeys_Spinning_Monkeys', 'act3', 119.0, 195.2, 30, -8, 1.5, 1.0),  # back to fun after the serious part
    ('Fluffing_a_Duck', 'act4', 0.0, 70.6, 0, -8, .5, .8),           # fast montage: writing → farming
    ('Sneaky_Snitch', 'act4', 70.6, 158.8, 20, -8, .6, .8),          # neighbors, vote, year 1,000, mammoths, Neanderthals
    ('Cipher2', 'act4', 166.85, 225.0, 0, -8, 1.0, 1.0),             # computer + Claude Code era
    ('Wholesome', 'act4', 242.85, 276.1, 0, -7, 1.5, 1.5),           # good side → space → museum
    ('Cipher2', 'act5', 0.0, 95.4, 60, -9, 1.0, .8),                 # the future world
    ('Sneaky_Snitch', 'act5', 95.5, 104.0, 0, -9, .3, .8),           # the cost (comic)
    ('Wholesome', 'act5', 104.1, 112.67, 40, -8, 1.5, .5),           # quiet ending
    ('Wholesome', 'act6', 0.0, 20.5, 60, -8, .5, .8),                # last campfire
    ('Monkeys_Spinning_Monkeys', 'act6', 20.5, 40.77, 0, -8, .5, 0),   # CTA + next time
    ('Monkeys_Spinning_Monkeys', 'end', 0.0, 12.0, 20.27, -7, 0, 2.5),  # end screen
]
music = np.zeros((N, 2), np.float32)
cache = {}
for trk, seg, a, b, toff, g, fi, fo in CUES:
    if trk not in cache: cache[trk] = load(T[trk], True)
    src = cache[trk]; L = int((b - a) * SR); o = int(toff * SR)
    piece = np.take(src, np.arange(o, o + L) % len(src), axis=0) * db(g + 3)
    e = np.ones(L, np.float32)
    if fi > 0: e[:int(fi * SR)] = np.linspace(0, 1, int(fi * SR))
    if fo > 0: e[-int(fo * SR):] *= np.linspace(1, 0, int(fo * SR))
    s = int((OFF[seg] + a) * SR); music[s:s + L] += piece * e[:, None]
# ducking from narration envelope
rms = np.sqrt(np.maximum(uniform_filter1d(voice ** 2, int(.05 * SR)), 0))
speak = (rms > .02).astype(np.float32)
sm = np.zeros_like(speak); att, rel = 1 - np.exp(-1 / (.06 * SR)), 1 - np.exp(-1 / (.45 * SR)); v = 0.
for i in range(0, N, 64):  # coarse envelope follower (per 64 samples)
    target = speak[i]; v += (target - v) * (1 - (1 - (att if target > v else rel)) ** 64); sm[i:i + 64] = v
music *= (1 - sm * (1 - db(-9)))[:, None]

# ---------- ambience ----------
amb = np.zeros(N, np.float32)
def amb_put(name, seg, a, b, g):
    src = load(f'{LIB}/sfx/{name}.wav'); L = int((b - a) * SR); piece = np.take(src, np.arange(L) % len(src)) * db(g)
    f = int(1.0 * SR); e = np.ones(L); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    s = int((OFF[seg] + a) * SR); amb[s:s + L] += piece * e
amb_put('amb_night', 'act1', 0, 24.5, -16); amb_put('amb_night', 'act2', 0, 56.0, -20); amb_put('amb_day', 'act3', 0, 106, -18); amb_put('amb_day', 'act3', 119, 195.2, -18)
amb_put('amb_night', 'act6', 0, 13.2, -16)

# ---------- SFX events: (seg, t, name, gain_db) ----------
E = []
def ev(seg, t, name, g=-8): E.append((seg, t, name, g))
# act 1
for t, n, g in [(2.25, 'whoosh_short', -10), (4.45, 'pop', -6), (4.5, 'ding', -12), (5.85, 'whoosh', -6), (7.75, 'typing', -12), (9.75, 'pop', -8), (13.0, 'boing', -9), (13.3, 'pop', -10), (17.4, 'riser', -10), (18.0, 'glitch', -6), (18.05, 'whoosh', -8), (20.75, 'whoosh_rev', -10), (23.0, 'boom', -2)]: ev('act1', t, n, g)
for i in range(8): ev('act1', 10.95 + i * .13, 'pop', -16)
for i in range(6): ev('act1', 23.3 + i * .12, 'tick', -10)
ev('sting', 0.0, 'whoosh', -6); ev('sting', .3, 'ding', -10)
# act 2
for t in [0.08, 8.64, 19.72, 27.52]: ev('act2', t, 'stamp', -6)
for t, n, g in [(1.3, 'pop', -10), (2.7, 'powerdown', -12), (5.6, 'stamp', -6), (5.95, 'pop', -10), (8.3, 'scratch', -6), (12.55, 'whoosh', -8), (13.2, 'pop', -12), (15.75, 'whoosh', -8), (18.2, 'stamp', -4), (24.0, 'pop', -10), (24.4, 'pop', -12), (31.0, 'pop', -10), (32.0, 'blow', -10), (36.2, 'notify', -6), (37.9, 'whoosh', -8), (42.46, 'pop', -12), (43.32, 'crickets', -10), (50.95, 'riser', -12), (51.75, 'chime', -8), (53.25, 'boom', -4), (53.55, 'stamp', -8), (54.55, 'whoosh_short', -8)]: ev('act2', t, n, g)
for i in range(8): ev('act2', 21.05 + i * .34, 'whoosh_short', -14)
for t in [39.47, 40.66, 49.35, 50.83]: ev('act2', t, 'ding', -12)
for t in [44.04, 45.19, 46.77, 47.71]: ev('act2', t, 'error', -14)
# act 3
for t, n, g in [(7.1, 'chomp', -8), (10.6, 'notify', -10), (12.4, 'pop', -10), (17.3, 'whoosh', -10), (20.4, 'pop', -12), (24.1, 'scribble', -10), (25.3, 'pop', -12), (28.4, 'scribble', -10), (34.6, 'pop', -10), (36.8, 'pop', -10), (39.9, 'stamp', -8), (46.4, 'typing', -12), (51.85, 'scribble', -12), (52.67, 'scribble', -12), (53.56, 'scribble', -12), (65.5, 'stamp', -10), (66.4, 'error', -12), (68.65, 'boom', -6), (70.2, 'whoosh', -10), (82.2, 'explosion', -2), (85.9, 'pop', -10), (90.4, 'pop', -12), (95.6, 'whoosh', -10), (101.6, 'whoosh_short', -8), (101.7, 'boing', -8), (106.3, 'drone', -10), (118.9, 'chime', -10), (124.5, 'stamp', -12), (129.7, 'notify', -10), (132.6, 'pop', -10), (134.6, 'pop', -10), (139.6, 'bees', -10), (142.6, 'bees', -10), (145.5, 'boing', -8), (148.3, 'ding', -10), (156.7, 'typing', -12), (159.4, 'pop', -10), (172.2, 'riser', -12), (175.0, 'chime', -8), (180.1, 'whoosh', -10), (185.0, 'notify', -10), (187.6, 'pop', -10), (190.9, 'whoosh_short', -8), (192.2, 'pop', -12), (193.5, 'pop', -10)]: ev('act3', t, n, g)
for i in range(6): ev('act3', 38.9 + i / 3, 'pop', -16)
for t in [72.9, 73.8, 75.3, 76.3, 97.0, 98.1, 99.3, 100.6]: ev('act3', t, 'pop', -12)
for i in range(12): ev('act3', 104.3 + i * .08, 'tick', -12)
for i in range(7): ev('act3', 153 + i * 2.2 + 2.5, 'tick', -8)
for i in range(10): ev('act3', 168 + i / 1.6, 'tick', -10)
for t in [14.0, 26.6, 41.0, 58.4, 108.2, 136.0, 167.0]: pass
# act 4: stage transitions
for t in [18.05, 38.3, 48.95, 70.6, 86.5, 113.5, 130.5, 145.0, 158.8, 166.85, 203.5, 211.65, 225.0, 242.85, 256.6, 269.45]: ev('act4', t, 'whoosh', -10)
for t, n, g in [(8.6, 'pop', -10), (14.4, 'pop', -12), (16.6, 'pop', -12), (35.2, 'crack', -8), (61.7, 'pop', -10), (69.9, 'stamp', -10), (72.9, 'notify', -10), (76.2, 'pop', -10), (77.4, 'pop', -10), (78.0, 'scribble', -12), (93.3, 'pop', -12), (99.6, 'whoosh', -10), (108.5, 'error', -10), (111.9, 'stamp', -6), (126.3, 'stamp', -8), (141.1, 'pop', -10), (155.6, 'stamp', -8), (161.6, 'zap', -8), (164.8, 'boom', -8), (169.6, 'beep', -10), (180.0, 'pop', -12), (181.2, 'typing', -12), (183.2, 'typing', -14), (187.8, 'error', -12), (190.9, 'typing', -14), (194.2, 'chime', -8), (195.4, 'ding', -12), (205.6, 'riser', -12), (208.2, 'stamp', -8), (221.3, 'pop', -10), (223.5, 'chime', -10), (228.6, 'error', -10), (231.9, 'powerdown', -12), (236.3, 'pop', -10), (258.2, 'stamp', -10), (260.3, 'whoosh', -10), (263.1, 'rocket', -10), (265.0, 'pop', -10), (272.6, 'ding', -14)]: ev('act4', t, n, g)
for i in range(12): ev('act4', 2.4 + i / 6, 'tick', -14)
for i in range(4): ev('act4', 36.6 + i * .35, 'pop', -14)
for t in [63.6, 64.2, 65.4, 67.6]: ev('act4', t, 'pop', -12)
for i in range(7): ev('act4', 84.0 + i * .25, 'pop', -16)
for i in range(10): ev('act4', 101 + i * .24, 'tick', -12)
for t in [117.4, 118.2, 118.8, 119.9, 121.2, 121.9]: ev('act4', t, 'pop', -12)
for i in range(3): ev('act4', 215.9 + i * .3, 'pop', -12); ev('act4', [218.2, 219.3, 220.3][i] + 1.6, 'ding', -14)
for t in [245.9, 247.8, 249.1, 251.1, 254.3]: ev('act4', t, 'pop', -10)
for t in [8.6, 58.0, 115.2, 136.4, 149.9, 183.5]: ev('act4', t + .05, 'pop', -14)  # real fact cards
# act 5
for t in [10.7, 22.0, 30.7, 35.9, 43.0, 52.2, 59.1, 69.9, 78.7, 89.2, 95.5]: ev('act5', t, 'whoosh_short', -10); ev('act5', t + .05, 'pop', -8)
for t, n, g in [(4.3, 'glitch', -10), (4.35, 'pop', -10), (8.6, 'pop', -12), (48.4, 'stamp', -12), (71.5, 'scribble', -8), (84.2, 'chime', -10), (102.6, 'stamp', -6), (104.1, 'whoosh_rev', -14), (111.0, 'ding', -14)]: ev('act5', t, n, g)
for i in range(8): ev('act5', 77.1 + i * .08, 'pop', -16)
# act 6
for t, n, g in [(9.7, 'notify', -10), (12.0, 'pop', -10), (13.2, 'whoosh', -8), (15.9, 'boing', -8), (17.2, 'whoosh', -8), (17.5, 'rocket', -6), (20.5, 'whoosh', -8), (27.6, 'pop', -10), (31.4, 'whoosh', -8), (31.5, 'notify', -8), (33.6, 'pop', -12), (34.4, 'pop', -12), (35.7, 'pop', -12), (38.0, 'stamp', -8), (38.1, 'chime', -8)]: ev('act6', t, n, g)
ev('end', 0.3, 'whoosh', -10)

sfx = np.zeros(N, np.float32); sc = {}
for seg, t, name, g in E:
    if name not in sc: sc[name] = load(f'{LIB}/sfx/{name}.wav')
    a = sc[name] * db(g); s = int((OFF[seg] + t) * SR); sfx[s:s + len(a)] += a[:max(0, N - s)]

mix = music + ((voice + sfx + amb)[:, None])
peak = np.max(np.abs(mix)); print('events', len(E), 'peak', round(float(peak), 3), 'total', TOTAL)
wavfile.write('/tmp/full/mix_raw.wav', SR, mix.astype(np.float32))
json.dump({'segments': SEGS, 'offsets': OFF, 'total': TOTAL, 'events': len(E)}, open('/tmp/full/timeline.json', 'w'))
