"""Cut 9:16 Shorts out of a 16:9 episode master.

Layout (1080x1920): blurred/dimmed full-frame background, a "camera window" that pans/zooms
over the 16:9 picture (keyframes in 1920x1080 coordinates), a 2-line hook header on top and
big word-chunk captions below the window. Audio = the finished episode mix for that span.

usage: python3 shorts.py <spec.json> <out.mp4>
spec: {master, header:[l1,l2], parts:[{src_from, src_to, act, act_from}], keys:[[t,cx,cy,vw,dur]],
       emph:[words], timing_dir}
  act/act_from map master time -> narration timing json (for captions).
"""
import json, sys, subprocess, re, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

spec = json.load(open(sys.argv[1])); OUT = sys.argv[2]
FPS = 30; W, H = 1080, 1920
FONT = '/home/claude/stone-age-upgrade/03_engine/fonts/ArchivoBlack-Regular.ttf'
INK, BONE, NEON, OCHRE = (30, 22, 18), (243, 230, 207), (61, 245, 255), (200, 118, 58)
master = spec['master']
probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', master], capture_output=True, text=True).stdout.strip().split(',')
SW, SH = int(probe[0]), int(probe[1]); K = SW / 1920

# ---------- captions from phrase timings ----------
chunks = []  # (t0, t1, text) in short time
tcur = 0.0
for part in spec['parts']:
    d = json.load(open(f"{spec['timing_dir']}/ep01_perde{part['act']}.timing.json"))
    a0, a1 = part['act_from'], part['act_from'] + (part['src_to'] - part['src_from'])
    for ph in d['phrases']:
        if ph['start'] < a0 - 0.05 or ph['start'] >= a1: continue
        words = ph['text'].replace('"', '').split()
        if not words: continue
        tot = sum(len(w) + 1 for w in words); acc = 0; times = []
        for w in words:
            times.append(ph['start'] + (ph['end'] - ph['start']) * acc / tot); acc += len(w) + 1
        grp = []
        for i, w in enumerate(words):
            if grp and sum(len(words[j]) + 1 for j in grp) + len(w) > 16:
                chunks.append([times[grp[0]] - a0 + tcur, None, ' '.join(words[j] for j in grp), ph['end'] - a0 + tcur]); grp = []
            grp.append(i)
            brk = len(grp) == 3 or re.search(r'[.,:?!…]$', w)
            if brk or i == len(words) - 1:
                chunks.append([times[grp[0]] - a0 + tcur, None, ' '.join(words[j] for j in grp), ph['end'] - a0 + tcur]); grp = []
    tcur += part['src_to'] - part['src_from']
DUR = tcur
for i, c in enumerate(chunks):
    nxt = chunks[i + 1][0] if i + 1 < len(chunks) else DUR
    c[1] = nxt if nxt - c[3] < 0.7 else c[3] + 0.35

font_c = ImageFont.truetype(FONT, 84); font_h = ImageFont.truetype(FONT, 92)
EMPH = set(w.upper() for w in spec.get('emph', []))
def text_img(words, font, stroke, colors):
    sp = font.getlength(' '); ws = [font.getbbox(w, stroke_width=stroke) for w in words]
    tw = int(sum(b[2] - b[0] for b in ws) + sp * (len(words) - 1)) + stroke * 2 + 8
    th = font.getbbox('HG', stroke_width=stroke)[3] + stroke * 2 + 8
    im = Image.new('RGBA', (tw, th), (0, 0, 0, 0)); dr = ImageDraw.Draw(im); x = stroke + 4
    for w, b, col in zip(words, ws, colors):
        dr.text((x - b[0], stroke + 4), w, font=font, fill=col, stroke_width=stroke, stroke_fill=INK); x += b[2] - b[0] + sp
    return im
def cap_img(txt):
    words = txt.upper().split()
    cols = [NEON if re.sub(r'[^A-Z0-9,]', '', w) in EMPH else BONE for w in words]
    im = text_img(words, font_c, 9, cols)
    if im.width > 980: im = im.resize((980, int(im.height * 980 / im.width)), Image.LANCZOS)
    return im
cap_cache = {}

hdr = Image.new('RGBA', (W, 330), (0, 0, 0, 0))
for i, line in enumerate(spec['header']):
    li = text_img(line.split(), font_h, 10, [BONE if i == 0 else NEON] * len(line.split()))
    if li.width > 1000: li = li.resize((1000, int(li.height * 1000 / li.width)), Image.LANCZOS)
    hdr.alpha_composite(li, ((W - li.width) // 2, 70 + i * 112))

# ---------- camera keyframes ----------
keys = spec['keys']
def ease(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)
def cam(t):
    st = keys[0][1:4]
    for k in keys[1:]:
        if t < k[0]: break
        e = ease((t - k[0]) / max(k[4], 1e-3)); st = [a + (b - a) * e for a, b in zip(st, k[1:4])]
    return st

# rounded-corner mask cache
def rmask(w, h, r=26):
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255); return m

# ---------- pipes ----------
dec = []
for part in spec['parts']:
    dec.append(subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', str(part['src_from']), '-t', str(part['src_to'] - part['src_from']), '-i', master,
                                 '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE))
# audio: concat parts from master
aflt = ''.join(f"[0:a]atrim={p['src_from']}:{p['src_to']},asetpts=PTS-STARTPTS[a{i}];" for i, p in enumerate(spec['parts']))
na = len(spec['parts'])
if na > 1:
    aflt += ''.join(f'[a{i}]' for i in range(na)) + f'concat=n={na}:v=0:a=1[ac];[ac]'
else:
    aflt += '[a0]'
aflt += f"afade=t=in:d=0.05,afade=t=out:st={DUR - 0.12:.3f}:d=0.12[aout]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', master, '-filter_complex', aflt, '-map', '[aout]', '-ar', '48000', '/tmp/short_audio.wav'], check=True)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-i', '/tmp/short_audio.wav', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'animation',
                        '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
fsz = SW * SH * 3; nframes = int(round(DUR * FPS)); fi = 0; pi = 0
WIN_CY = 860
while fi < nframes:
    buf = dec[pi].stdout.read(fsz)
    if len(buf) < fsz:
        pi += 1
        if pi >= len(dec): break
        continue
    t = fi / FPS
    src = Image.frombuffer('RGB', (SW, SH), buf, 'raw', 'RGB', 0, 1)
    # background: cover + blur + dim
    small = src.resize((SW // 8, SH // 8), Image.BILINEAR)
    bw = int(H * SW / SH) // 8; bg = small.resize((bw, H // 8), Image.BILINEAR)
    l = (bw - W // 8) // 2; bg = bg.crop((l, 0, l + W // 8, H // 8)).filter(ImageFilter.GaussianBlur(3)).resize((W, H), Image.BILINEAR)
    bg = Image.blend(bg, Image.new('RGB', (W, H), INK), .55).convert('RGBA')
    cx, cy, vw = cam(t)
    vh = min(vw, 1080.0)
    cx = min(max(cx, vw / 2), 1920 - vw / 2); cy = min(max(cy, vh / 2), 1080 - vh / 2)
    box = ((cx - vw / 2) * K, (cy - vh / 2) * K, (cx + vw / 2) * K, (cy + vh / 2) * K)
    ww = W; wh = int(round(W * vh / vw))
    win = src.resize((ww, wh), Image.LANCZOS, box=box)
    y0 = WIN_CY - wh // 2
    bg.paste(win, (0, y0), rmask(ww, wh, 0))
    d = ImageDraw.Draw(bg); d.line((0, y0, W, y0), fill=INK, width=6); d.line((0, y0 + wh, W, y0 + wh), fill=INK, width=6)
    bg.alpha_composite(hdr, (0, 0))
    for c in chunks:
        if c[0] <= t < c[1]:
            if c[2] not in cap_cache: cap_cache[c[2]] = cap_img(c[2])
            im = cap_cache[c[2]]; k = 1 + .14 * (1 - ease((t - c[0]) / .12))
            if k != 1: im = im.resize((int(im.width * k), int(im.height * k)), Image.BILINEAR)
            bg.alpha_composite(im, ((W - im.width) // 2, 1490 - im.height // 2)); break
    enc.stdin.write(bg.convert('RGB').tobytes()); fi += 1
    if fi % 150 == 0: print(f'{fi}/{nframes}', flush=True)
enc.stdin.close(); enc.wait()
for p in dec: p.kill()
print('done', OUT, fi, 'frames', round(DUR, 2), 's')
