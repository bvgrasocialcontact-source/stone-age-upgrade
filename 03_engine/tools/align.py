"""Cümle/ifade zamanlaması: ses dosyasındaki dijital sessizlik boşluklarını bulur,
metni noktalama yerlerinden ifadelere böler ve DP ile eşleştirir (ASR gerektirmez).
Kullanım: python3 align.py audio.mp3 text.txt out.json"""
import sys, re, json, subprocess, math
import numpy as np
audio, textf, out = sys.argv[1:4]
raw = subprocess.run(['ffmpeg','-v','error','-i',audio,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a = np.frombuffer(raw, dtype=np.int16).astype(float)/32768
W = 160  # 10 ms
db = np.array([20*math.log10(math.sqrt(np.mean(a[i:i+W]**2))+1e-9) for i in range(0, len(a)-W, W)])
sil = db < -55
# speech regions: merge gaps shorter than 120 ms
segs=[]; i=0; n=len(db)
while i<n:
    if sil[i]: i+=1; continue
    j=i
    while j<n:
        if sil[j]:
            k=j
            while k<n and sil[k]: k+=1
            if k-j < 12 and k<n: j=k; continue
            break
        j+=1
    if j-i >= 8: segs.append([i/100, j/100])
    i=j
text = open(textf, encoding='utf-8').read()
tags = {}
# phrases: split after punctuation that tends to produce a pause
phr=[]
for para in re.split(r'\n\s*\n', text):
    clean = re.sub(r'\s+', ' ', para).strip()
    if not clean: continue
    parts = re.split(r'(?<=[\.\?\!:;…—,])\s+|(?<=[\.\?\!,]["”])\s+', clean)
    for p in parts:
        t = re.findall(r'\[([^\]]+)\]', p)
        plain = re.sub(r'\[[^\]]+\]\s*', '', p).strip()
        if not plain: continue
        phr.append({'text': plain, 'tags': t, 'words': len(re.findall(r"[A-Za-z0-9']+", plain)), 'pe': False})
    if phr: phr[-1]['pe'] = True
TW = sum(p['words'] for p in phr); TS = sum(e-s for s,e in segs)
rate = TW/TS
P, S = len(phr), len(segs)
INF=1e18
dp=[[INF]*(S+1) for _ in range(P+1)]; bk=[[None]*(S+1) for _ in range(P+1)]
dp[0][0]=0
for i in range(P+1):
    for j in range(S+1):
        if dp[i][j]>=INF: continue
        for k in range(1,6):
            if i+k>P: break
            w=sum(p['words'] for p in phr[i:i+k])
            for m in range(1,4):
                if j+m>S: break
                d=segs[j+m-1][1]-segs[j][0]
                c=(math.log((d+0.15)/(w/rate+0.15)))**2*w + 0.4*(k-1) + 0.6*(m-1)
                gap = (segs[j+m][0]-segs[j+m-1][1]) if j+m<S else 9
                if phr[i+k-1]['pe'] and gap < 0.3: c += 3
                if any(p['pe'] for p in phr[i:i+k-1]): c += 4
                if not phr[i+k-1]['pe'] and gap > 0.33: c += 0.1
                # end-of-sentence phrases should end at a gap
                if dp[i][j]+c<dp[i+k][j+m]:
                    dp[i+k][j+m]=dp[i][j]+c; bk[i+k][j+m]=(i,j)
i,j=P,S; groups=[]
while i>0:
    pi,pj=bk[i][j]; groups.append((pi,i,pj,j)); i,j=pi,pj
groups.reverse()
res=[]
for pi,pe,sj,se in groups:
    s,e=segs[sj][0],segs[se-1][1]
    w=sum(p['words'] for p in phr[pi:pe]); t=s
    for p in phr[pi:pe]:
        d=(e-s)*p['words']/w
        res.append({'start':round(t,2),'end':round(t+d,2),'text':p['text'],'tags':p['tags'],'para_end':p['pe']}); t+=d
dur=len(a)/16000
json.dump({'audio':audio.split('/')[-1],'duration':round(dur,2),'rate_wps':round(rate,2),'speech_segments':segs,'phrases':res},open(out,'w'),indent=1,ensure_ascii=False)
for r in res: print(f"{r['start']:7.2f}-{r['end']:7.2f} {' '.join('['+x+']' for x in r['tags'])} {r['text']}" + (' ¶' if r['para_end'] else ''))
