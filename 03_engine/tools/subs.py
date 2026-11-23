"""Build subtitle cues from align.py phrase timings.
python3 subs.py <episode_dir> <prefix e.g. ep02> <timeline.json> <out_dir> [--lead 1.0]
- timeline.json: {"offsets": {"act1": sec, ...}} (written by tools/mix_epNN.py)
- writes <out_dir>/<prefix>_cues.json and <PREFIX>_en.srt
- cues: phrases merged up to ~84 chars / 6.5 s, never across paragraph ends; 2 lines max (~42 chars)
- if <out_dir>/<prefix>_tr_lines.txt exists (one line per cue id, same order), also writes <PREFIX>_tr.srt"""
import json, os, re, sys

ep, pre, tl, out = sys.argv[1:5]
LEAD = float(sys.argv[sys.argv.index('--lead') + 1]) if '--lead' in sys.argv else 1.0
off = json.load(open(tl))['offsets']
MAXC, MAXD = 84, 6.5

def wrap(s, w=42):
    if len(s) <= w: return s
    words = s.split(); best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, a, b)
    return best[1] + '\n' + best[2]

def ts(x):
    x = max(0, x); h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}'

cues = []
for i in range(1, 7):
    d = json.load(open(f'{ep}/02_audio/{pre}_perde{i}.timing.json'))
    base = off[f'act{i}'] + LEAD
    cur = None
    for ph in d['phrases']:
        txt = re.sub(r'\[[^\]]*\]', '', ph['text']).strip()
        if not txt: continue
        s, e = base + ph['start'], base + ph['end']
        if cur and len(cur['en']) + 1 + len(txt) <= MAXC and e - cur['s'] <= MAXD and not cur['_pe']:
            cur['en'] += ' ' + txt; cur['e'] = e; cur['_pe'] = ph.get('para_end', False)
        else:
            if cur: cues.append(cur)
            cur = {'s': s, 'e': e, 'en': txt, '_pe': ph.get('para_end', False)}
    if cur: cues.append(cur)
for k, c in enumerate(cues):
    c.pop('_pe'); c['id'] = k + 1
    nxt = cues[k + 1]['s'] if k + 1 < len(cues) else c['e'] + 2
    c['e'] = round(min(max(c['e'] + .25, c['s'] + 1.0), nxt - .05), 2); c['s'] = round(c['s'], 2)
cues = [{'id': c['id'], 's': c['s'], 'e': c['e'], 'en': c['en']} for c in cues]
os.makedirs(out, exist_ok=True)
json.dump(cues, open(f'{out}/{pre}_cues.json', 'w'), indent=0, ensure_ascii=False)
def srt(lines, path):
    with open(path, 'w') as f:
        for c, l in zip(cues, lines): f.write(f"{c['id']}\n{ts(c['s'])} --> {ts(c['e'])}\n{wrap(l)}\n\n")
srt([c['en'] for c in cues], f'{out}/{pre.upper()}_en.srt')
trp = f'{out}/{pre}_tr_lines.txt'
if os.path.exists(trp):
    tr = [l.rstrip('\n') for l in open(trp) if l.strip()]
    assert len(tr) == len(cues), f'tr lines {len(tr)} != cues {len(cues)}'
    srt(tr, f'{out}/{pre.upper()}_tr.srt')
print(len(cues), 'cues', 'last end', cues[-1]['e'])
