"""EP02 (Car) final audio mix: narration + music bed (ducked) + in-house SFX + ambience.
Writes /tmp/ep02/mix_raw.wav (48 kHz stereo float) and timeline JSON. Same method as mix_ep01.py."""
import json, os, subprocess, numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d

SR = 48000
ROOT = '/home/claude/stone-age-upgrade'
EP = ROOT + '/01_episodes/EP02_Car'
LIB = ROOT + '/02_library/audio'
OUT = '/tmp/ep02'; os.makedirs(OUT, exist_ok=True)
FPS = 30
SEGS = [('act1', 686), ('sting', 45), ('act2', 1674), ('act3', 6108), ('act4', 7652), ('act5', 3294), ('act6', 1288), ('end', 360)]
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
    a = load(f'{EP}/02_audio/ep02_perde{i}.mp3'); s = int(OFF[f'act{i}'] * SR); voice[s:s + len(a)] += a

# ---------- music cues: (track, seg, start, end, track_offset, gain_db, fade_in, fade_out) ----------
T = {k: f'{LIB}/music/KevinMacLeod_{k}.mp3' for k in ['Investigations', 'Monkeys_Spinning_Monkeys', 'Sneaky_Snitch', 'Fluffing_a_Duck', 'Cipher2', 'Wholesome']}
CUES = [
    ('Investigations', 'act1', 0.0, 21.4, 0, -6, 1.5, .3),            # hook: wake up next to a car
    ('Sneaky_Snitch', 'act2', 0.3, 55.8, 0, -7, .3, 1.0),             # problems + v1.0
    ('Monkeys_Spinning_Monkeys', 'act3', 0.0, 58.3, 0, -8, .5, .6),     # day one, first drive, first crash
    ('Fluffing_a_Duck', 'act3', 58.3, 109.7, 0, -8, .4, .8),          # ostrich race + hunting
    ('Monkeys_Spinning_Monkeys', 'act3', 109.7, 203.6, 60, -8, .8, 1.0),  # house, cup, manual, road trip, year one
    ('Fluffing_a_Duck', 'act4', 0.0, 46.8, 30, -8, .5, .8),           # carts, ostrich power, first jam
    ('Sneaky_Snitch', 'act4', 46.8, 112.7, 20, -8, .6, .8),           # herds, rules, Ug, ticket, temple
    ('Investigations', 'act4', 112.7, 127.9, 30, -8, .8, .8),          # metal, oil, oil wars
    ('Fluffing_a_Duck', 'act4', 127.9, 175.9, 80, -8, .6, .8),        # steam car, Benz, brands, weird cars
    ('Cipher2', 'act4', 175.9, 205.2, 0, -9, 1.0, .8),                # city, jams, smoke, crashes, seatbelt
    ('Wholesome', 'act4', 205.2, 214.2, 0, -8, .8, .6),               # good side
    ('Monkeys_Spinning_Monkeys', 'act4', 214.2, 237.8, 120, -8, .5, .8),  # flying cars, sky jam
    ('Wholesome', 'act4', 237.8, 255.05, 20, -7, 1.0, 1.0),           # self-driving, museum
    ('Cipher2', 'act5', 0.0, 89.8, 40, -9, 1.0, .8),                  # the year 300,000 A.V.
    ('Sneaky_Snitch', 'act5', 89.8, 100.8, 60, -9, .3, .8),           # the cost
    ('Wholesome', 'act5', 100.8, 109.8, 50, -8, 1.5, .5),             # neighbors
    ('Wholesome', 'act6', 0.0, 22.6, 70, -8, .5, .8),                 # day one leg → museum → ostrich
    ('Monkeys_Spinning_Monkeys', 'act6', 22.6, 42.92, 0, -8, .5, 0),   # CTA + next time
    ('Monkeys_Spinning_Monkeys', 'end', 0.0, 12.0, 20.32, -7, 0, 2.5),  # end screen
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
rms = np.sqrt(np.maximum(uniform_filter1d(voice ** 2, int(.05 * SR)), 0))
speak = (rms > .02).astype(np.float32)
sm = np.zeros_like(speak); att, rel = 1 - np.exp(-1 / (.06 * SR)), 1 - np.exp(-1 / (.45 * SR)); v = 0.
for i in range(0, N, 64):
    target = speak[i]; v += (target - v) * (1 - (1 - (att if target > v else rel)) ** 64); sm[i:i + 64] = v
music *= (1 - sm * (1 - db(-9)))[:, None]

# ---------- ambience ----------
amb = np.zeros(N, np.float32)
def amb_put(name, seg, a, b, g):
    src = load(f'{LIB}/sfx/{name}.wav'); L = int((b - a) * SR); piece = np.take(src, np.arange(L) % len(src)) * db(g)
    f = int(min(1.0, (b - a) / 3) * SR); e = np.ones(L); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    s = int((OFF[seg] + a) * SR); amb[s:s + L] += piece * e
amb_put('amb_day', 'act1', 0, 13.3, -16)
amb_put('amb_day', 'act2', 0, 55.8, -22)
amb_put('amb_day', 'act3', 0, 109.7, -18); amb_put('amb_night', 'act3', 109.7, 121.3, -18); amb_put('amb_day', 'act3', 121.3, 203.6, -20)
amb_put('amb_engine', 'act3', 29.6, 58.0, -24)
amb_put('amb_day', 'act4', 0, 53.2, -20)
amb_put('amb_engine', 'act4', 176.0, 193.6, -26)
amb_put('amb_night', 'act6', 0, 8.4, -16)

# ---------- SFX events: (seg, t, name, gain_db) ----------
E = []
def ev(seg, t, name, g=-8): E.append((seg, t, name, g))
# act 1 — wake up, car reveal, logo, TODAY?, problems
for t, n, g in [(1.6, 'blow', -14), (4.9, 'whoosh_short', -10), (5.1, 'ding', -8), (6.1, 'pop', -8), (7.1, 'pop', -8), (8.0, 'pop', -8), (9.6, 'whoosh', -10), (11.6, 'stamp', -6), (13.2, 'glitch', -6), (13.3, 'whoosh', -8), (15.5, 'passby', -12), (18.4, 'squawk', -10), (20.2, 'whoosh_rev', -10), (21.45, 'boom', -2)]: ev('act1', t, n, g)
for i in range(6): ev('act1', 5.3 + i * .14, 'tick', -16)
ev('sting', 0.0, 'whoosh', -6); ev('sting', .3, 'ding', -10)
# act 2 — four problems + v1.0
for t in [0.1, 9.8, 18.2, 24.8]: ev('act2', t, 'stamp', -6)
for t, n, g in [(2.6, 'tick', -12), (5.8, 'powerdown', -12), (8.1, 'bonk', -8), (12.9, 'pop', -12), (13.9, 'pop', -12), (14.4, 'pop', -12), (16.0, 'trumpet', -14), (16.3, 'crash', -10), (21.9, 'boing', -8), (26.1, 'skid', -10), (27.1, 'powerdown', -12), (31.8, 'riser', -12), (33.0, 'chime', -8), (34.5, 'ding', -12), (36.7, 'ding', -12), (39.9, 'pop', -10), (41.1, 'pop', -12), (45.3, 'error', -14), (46.1, 'error', -14), (47.0, 'error', -14), (49.3, 'pop', -12), (51.0, 'zap', -12), (53.1, 'stamp', -8), (54.4, 'squawk', -12)]: ev('act2', t, n, g)
# act 3 — day one … year one
for t, n, g in [(6.9, 'chomp', -10), (9.4, 'crickets', -12), (11.9, 'pop', -12), (13.1, 'pop', -14), (17.3, 'honk', -2), (18.0, 'whoosh', -8), (19.0, 'scribble', -12),
                (25.7, 'whoosh', -10), (29.0, 'click', -8), (29.3, 'engine_start', -6), (38.2, 'pop', -10), (39.6, 'vroom', -4), (43.3, 'crickets', -30), (48.2, 'skid', -6), (49.0, 'crash', -2), (49.3, 'tweet', -10), (54.8, 'boing', -10),
                (58.3, 'whoosh', -10), (63.5, 'squawk', -6), (64.5, 'vroom', -6), (66.7, 'tick', -10), (67.7, 'tick', -10), (69.2, 'tick', -10), (75.1, 'crash', -6), (76.7, 'squawk', -6), (78.2, 'pop', -12),
                (85.3, 'whoosh', -10), (86.3, 'vroom', -8), (92.8, 'skid', -6), (97.3, 'pop', -10), (99.4, 'pop', -10), (101.3, 'vroom', -10),
                (109.7, 'whoosh', -10), (113.5, 'pop', -12), (114.5, 'boing', -10), (121.3, 'whoosh', -10), (124.7, 'crickets', -16), (127.7, 'scribble', -10), (129.9, 'ding', -10),
                (134.5, 'whoosh', -10), (135.6, 'pop', -10), (141.4, 'pop', -12), (142.2, 'pop', -12), (143.1, 'pop', -12), (144.8, 'scribble', -10), (146.9, 'bonk', -8), (148.4, 'ding', -10), (150.1, 'chime', -8), (154.2, 'pop', -12),
                (160.0, 'whoosh', -10), (163.0, 'passby', -10), (168.5, 'ding', -12), (170.2, 'whoosh_short', -8), (175.6, 'honk', -4), (178.3, 'chime', -10),
                (188.0, 'whoosh', -8), (188.2, 'stamp', -8), (189.0, 'pop', -12), (191.5, 'pop', -12), (194.2, 'pop', -12), (196.3, 'pop', -12), (198.1, 'error', -12), (200.9, 'stamp', -6), (201.0, 'pop', -12)]: ev('act3', t, n, g)
for i in range(8): ev('act3', 19.2 + i * .25, 'pop', -16)   # tribe scrambles up the tree
for i in range(5): ev('act3', 1.9 + i * .3, 'pop', -18)
# act 4 — stage transitions
for t in [11.7, 25.5, 53.2, 77.9, 95.8, 112.7, 127.9, 156.4, 175.9, 214.2, 237.8]: ev('act4', t, 'whoosh', -10)
for t in [53.2, 77.9, 95.8, 112.7, 127.9, 156.4, 175.9, 214.2, 237.8]:
    for i in range(6): ev('act4', t + .1 + i * .08, 'tick', -16)
for t, n, g in [(2.9, 'scribble', -12), (9.5, 'stamp', -6), (12.3, 'blow', -12), (13.2, 'ding', -10), (15.7, 'squawk', -8), (17.1, 'squawk', -6), (19.6, 'whoosh', -8), (21.5, 'stamp', -6), (24.5, 'pop', -12),
                (33.2, 'honk', -10), (33.6, 'honk', -12), (35.4, 'trumpet', -8), (38.5, 'chime', -10), (46.8, 'error', -10), (51.3, 'crickets', -16),
                (55.6, 'bonk', -4), (57.0, 'stamp', -8), (62.0, 'pop', -10), (64.0, 'pop', -10), (67.3, 'pop', -14), (73.8, 'explosion', -10), (74.7, 'ding', -10),
                (79.2, 'stamp', -6), (80.7, 'bonk', -10), (83.2, 'blow', -14), (85.5, 'stamp', -8), (87.2, 'pop', -14),
                (99.6, 'amb_engine', -20), (104.5, 'honk', -6), (106.3, 'pop', -12), (110.5, 'scribble', -10),
                (116.1, 'steam', -12), (118.1, 'pop', -10), (118.4, 'pop', -10), (119.0, 'pop', -10), (124.4, 'stamp', -6), (125.1, 'boom', -6), (125.3, 'drone', -16),
                (129.4, 'engine_start', -8), (132.3, 'steam', -10), (134.7, 'pop', -12), (137.1, 'squawk', -10), (139.0, 'pop', -14), (150.1, 'ding', -10), (152.2, 'chime', -10),
                (159.2, 'stamp', -8), (160.5, 'stamp', -8), (161.6, 'stamp', -8), (162.5, 'stamp', -8), (166.6, 'boing', -8), (169.6, 'blow', -12), (171.4, 'pop', -12), (172.6, 'trumpet', -8), (174.2, 'crash', -4),
                (177.5, 'pop', -12), (181.0, 'honk', -10), (181.4, 'honk_long', -16), (183.4, 'blow', -12), (187.6, 'skid', -10), (187.9, 'crash', -10), (189.0, 'pop', -14),
                (195.7, 'pop', -10), (200.8, 'click', -4), (203.7, 'stamp', -6), (207.7, 'pop', -10), (208.7, 'pop', -10), (211.2, 'pop', -10),
                (218.3, 'pop', -14), (222.1, 'pop', -10), (224.0, 'riser', -10), (225.2, 'zap', -12), (232.2, 'stamp', -8), (233.3, 'honk', -8), (233.6, 'honk_long', -14), (235.6, 'tweet', -6), (236.0, 'squawk', -10),
                (239.6, 'chime', -10), (241.5, 'whoosh', -10), (245.1, 'pop', -10), (246.3, 'amb_engine', -20), (247.7, 'tick', -10), (252.3, 'whoosh_short', -10), (254.1, 'ding', -10)]: ev('act4', t, n, g)
for i in range(6): ev('act4', 5.3 + i * .5, 'pop', -16)    # cart copies appear
for i in range(14): ev('act4', 247.8 + i * .24, 'tick', -16)  # odometer
for t in [67.3, 87.2, 138.9, 145.1, 188.9]: ev('act4', t + .05, 'pop', -14)  # real fact cards
# act 5 — the list
for t in [11.0, 18.1, 26.4, 34.6, 44.3, 52.4, 58.7, 68.7, 77.7, 84.7, 89.8]: ev('act5', t, 'whoosh_short', -10); ev('act5', t + .05, 'pop', -8)
for t, n, g in [(2.3, 'glitch', -10), (4.6, 'glitch', -12), (7.2, 'stamp', -10), (7.9, 'vroom', -8), (15.5, 'pop', -12), (24.8, 'ding', -12), (28.2, 'scribble', -8), (31.0, 'vroom', -10), (31.2, 'squawk', -8), (33.0, 'stamp', -10),
                (37.2, 'trumpet', -12), (39.8, 'honk', -12), (41.4, 'pop', -10), (49.9, 'pop', -12), (51.4, 'stamp', -10), (53.2, 'honk', -4), (56.4, 'honk_long', -8),
                (59.5, 'honk_long', -18), (61.9, 'pop', -12), (63.3, 'pop', -12), (64.7, 'pop', -12), (66.0, 'stamp', -10), (74.6, 'ding', -10), (79.5, 'stamp', -8), (81.3, 'riser', -14), (82.6, 'notify', -8),
                (87.3, 'boing', -8), (91.8, 'tick', -12), (94.1, 'pop', -10), (97.2, 'blow', -12), (100.8, 'whoosh_rev', -14), (108.8, 'chime', -10)]: ev('act5', t, n, g)
for i in range(10): ev('act5', 59.5 + i * .21, 'tick', -16)
# act 6
for t, n, g in [(3.2, 'pop', -12), (4.7, 'chomp', -16), (8.4, 'whoosh', -8), (10.5, 'pop', -12), (13.0, 'ding', -10), (14.5, 'whoosh', -8), (15.7, 'stamp', -10), (16.8, 'squawk', -6), (19.4, 'stamp', -8), (21.4, 'pop', -12),
                (22.6, 'whoosh', -8), (29.5, 'pop', -10), (30.7, 'notify', -10), (33.5, 'whoosh', -8), (34.2, 'beep', -10), (35.8, 'pop', -12), (36.7, 'pop', -12), (37.9, 'pop', -12), (39.1, 'pop', -12), (39.8, 'stamp', -8), (39.9, 'chime', -8)]: ev('act6', t, n, g)
for i in range(5): ev('act6', 18.0 + i * .25, 'ding', -18)
for i in range(10): ev('act6', 37.9 + i * .09, 'pop', -18)
ev('end', 0.3, 'whoosh', -10)

sfx = np.zeros(N, np.float32); sc = {}
for seg, t, name, g in E:
    if name not in sc: sc[name] = load(f'{LIB}/sfx/{name}.wav')
    a = sc[name] * db(g); s = int((OFF[seg] + t) * SR); a = a[:max(0, N - s)]; sfx[s:s + len(a)] += a

mix = music + ((voice + sfx + amb)[:, None])
peak = np.max(np.abs(mix)); print('events', len(E), 'peak', round(float(peak), 3), 'total', TOTAL)
wavfile.write(OUT + '/mix_raw.wav', SR, mix.astype(np.float32))
json.dump({'segments': SEGS, 'offsets': OFF, 'total': TOTAL, 'events': len(E)}, open(OUT + '/timeline.json', 'w'), indent=1)
