# Stone Age Upgrade — Production Playbook (Üretim Rehberi)

> Türkçe özet: Bu dosya bir bölümün baştan sona nasıl üretildiğini anlatır (EP01'de öğrendiğimiz her şey).
> Sohbet kaybolsa bile yeni bir Claude oturumu bu klasörden aynı kalitede devam edebilir.
> Okuma sırası: `CLAUDE.md` → bu dosya → `00_docs/KANAL_KITABI.md` → `PRODUCTION_LOG.md` (son kararlar).
> Buğra ile her zaman Türkçe, kısa ve sade konuş.

Written for Claude (future sessions). Every rule here was either decided by Buğra or learned the hard way on EP01.

---

## 0. Non-negotiables
- Channel bible: `00_docs/KANAL_KITABI.md` (export of the claude.ai doc). Same concept, same character (You, tuft, Style 1), same narrator voice, same thumbnail language, same HUD look. **Never change a chosen design without asking.**
- Independent episodes: every episode starts from zero (300,000 years ago, you wake up holding tech X). One technology per episode; nothing else modern.
- Script shows **benefits AND costs** of every change (Buğra).
- Three kinds of moments mixed: realistic / absurd / "that actually makes sense". From EP02 on: **more absurdity** (Buğra 23.11).
- Dinosaur running gag once per episode: "no dinosaurs… technically one" → ostrich.
- Long video: 16:9, 10:00–12:00, 30 fps. Upload master is 2K (see §6). Shorts 9:16, 15–35 s.
- Brand/IP: **no real logos ever** (Anthropic, car makers, consoles…). Brand **names** may be said/written as plain text (nominative use). Draw generic devices. No film/game/TV characters.
- Music: never copyrighted songs, not even 1–3 s. Kevin MacLeod CC BY 4.0 (credit line in every description, incl. Shorts) + YouTube Audio Library + our own synthesized SFX.
- Paid credits (ElevenLabs, Flow, Higgsfield): only with Buğra's explicit OK in chat. Narration uses **his** ElevenLabs.
- Log every decision in `PRODUCTION_LOG.md` (Turkish). Commit + push after each meaningful step; mirror changed files to his PC folder `C:\Users\BUĞRA\Desktop\StoneAgeUpgrade` with `device_commit_files` when the desktop app is connected.

## 1. Episode skeleton (from the bible; EP01 timings)
| # | Part | EP01 length | Content |
|---|------|-------------|---------|
| 1 | Hook | 0:25 | "Three hundred thousand years ago, you wake up…" tech in hand within 5 s; promise the big question |
| 2 | Reality check | 0:56 | 3–4 realistic problems → "let's install an upgrade: Version 1.0" (what you get, what you DON'T get) + dinosaur tease |
| 3 | Day 1 → Year 1 | 3:15 | personal scale, tribe, comedy, 2–4 Real Facts |
| 4 | Year 10 → 100,000 | 4:36 | civilization, time jumps, HUD numbers exploding, benefits + costs |
| 5 | Today | 1:53 | "Here's what's different from your world": 10 numbered differences + one cost |
| 6 | Close | 0:41 | callback to Day 1, dinosaur/ostrich payoff, comment question, "Next time: …" + subscribe |
Sting (1.5 s brand card) goes **after** the hook. End screen 12 s at the end. Narration ≈ 2,000 words → ~11:45 after atempo 0.95.

## 2. Script
1. Research first (WebSearch): every Real Fact needs a source (goes to the description). Keep a `01_script/research.md`.
2. Impact map (bible): score 7 domains 0–5; the world only changes where the score is high.
3. Write per act: `01_script/act1.txt … act6.txt` + full `narration_en_final.txt`. Use ElevenLabs v4 audio tags: `[excited] [deadpan] [whispers] [short pause] [laughs] [sighs] [mischievously] [serious] [softly] [awed] [dramatic] [curious] [proud] [warm]`. Tags are stripped from subtitles/captions.
4. Send Buğra a short Turkish summary of the story beats (he doesn't read English). He has delegated script/voice/edit to Claude ("sana bırakıyorum"), so proceed unless he objects.

## 3. Voice (ElevenLabs, via Claude in Chrome — his signed-in Chrome)
- Voice: "Sheldon - Quirky, Clever, Enthusiastic" (My Voices). Model **Eleven v4**, stability 50, similarity 80, **auto-tag OFF**.
- One generation per act; ElevenLabs returns 2 takes → pick the technically clean one (no clipped words, no weird silences; default take 2). Raw takes → `02_audio/raw/` (git-ignored).
- Process: `ffmpeg -i in.mp3 -af "atempo=0.95,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" -c:a libmp3lame -b:a 192k 02_audio/epNN_perdeK.mp3`
- Credits: EP01 used ~2,000 words ≈ 12k chars + re-records. After EP01 ~17.5k chars were left (22.11). Check the balance before generating.
- Downloads in Chrome: Buğra had to allow downloads once; scripted blob downloads are blocked → use the site's own download button.

## 4. Timing
`python3 03_engine/tools/align.py 02_audio/epNN_perdeK.mp3 01_script/actK.txt 02_audio/epNN_perdeK.timing.json`
(silence segmentation + DP match of punctuation-split phrases; no ASR). Scenes key animation beats to these phrase times. Write a readable sheet `01_script/epNN_timing.md`.

## 5. Animation (03_engine)
- Scene = HTML page driven by `window.SAU` (`SAU.init`, `SAU.seek(t)`, `p(t,a,b,ease)`, `E` easings, `boil()`, `noiseURL()`); You rig `SAU.makeYou(parent, rc, o).pose({...}, t)`; shared kit `lib/kit.js` (backgrounds, HUD panels, Real Fact card, callouts, stamps, chat windows, code panel…). Extend the kit per episode in a new IIFE section; never break old scenes.
- Scenes are laid out in **1920×1080 px**. Keep text inside safe margins (HUD top-left year panel, top-right stats panel; titles at H*.27 to avoid the HUD).
- Check stills often: `node still.mjs scenes/x.html /tmp/a.png --t 12.3`. Look at them (Read) before rendering.
- Preview renders per act: `node render.mjs scenes/epNN_actK.html out.mp4 --audio 02_audio/epNN_perdeK.mp3` (1080p, fast). Send previews to Buğra.
- Speed ≈ 4–10 fps on 2 cores → render in chunks < 10 min per command (`--from/--to`), background job + polling.
- Common EP01 bugs: text overflow (wrap), objects covering text, missing glyphs (∞ not in Anonymous Pro → Inter), undefined `CL` in a new kit IIFE (`const CL = SAU.CL`), zoomed camera revealing scene edges (extend backgrounds to -W..2W), gradients referenced but not defined.

## 6. Final master (2K) — exact recipe
1. Render every segment (acts + `epNN_sting.html` + `epNN_endscreen.html`) with
   `node render.mjs <scene> <chunk.mp4> --w 1920 --h 1080 --dsf 1.3333333333 --jq 100 --qp 0 --preset ultrafast --from A --to B`
   (**never `--w 2560`**: layouts are in 1080p px; `--dsf` re-rasterizes at 2560×1440, 2× sharper than upscaling). 50 s chunks; resumable driver like `/tmp/hq/run.sh` (see log 23.11).
2. Per segment: concat chunks, `tpad=stop_mode=clone:stop_duration=2,trim=end_frame=FR` to the exact frame count, encode once: `libx264 -preset medium -tune animation -crf 14 -profile:v high -r 30 -g 60 -bf 2`.
3. **First segment gets a 30-frame lead-in** (`tpad=start=30:start_mode=clone`) and the audio gets 1 s of fading-in ambience: narration must never start at 0 s (players swallow the first word — EP01 bug).
4. Audio: `python3 03_engine/tools/sfx.py 02_library/audio/sfx` (synth SFX), mix script like `tools/mix_ep01.py` (narration at segment offsets, music cues ducked ~9 dB under speech, ambience, SFX events), then alimiter + two-pass loudnorm to **-14 LUFS, TP -1.5**.
5. `concat -c copy` the segment files + mux audio (AAC 384k, 48 kHz, `-movflags +faststart`).
6. QC: duration 10–12 min, -14 LUFS, frame-diff vs. approved previews, look at stills from every act, check the first 2 s audio.
7. Delivery: files > 400 MB → byte-split `.part` files (`split -n 3 -d`) + `EPxx_2K_BIRLESTIR.bat` (`copy /y /b a+b+c out.mp4`) to the PC; files ≤ 500 MB can also go via SendUserFile.

## 7. Thumbnail (Package 2, "B" style — chosen 23.11)
`03_engine/scenes/brand.html?pkg=2&asset=thumb_epNN` at 1280×720 (`node still.mjs … --w 1280 --h 720 --q "pkg=2&asset=…"`).
Left: warm savanna, You (shocked) holding the episode's tech, face ≈ 1/3. Right: night/neon alternate TODAY with ONE strong episode image (EP01: stone-neon city; car episode: **stone highway**), plus B-style extras (stars, neon trails, glow). Only two tags: "300,000 BC" (ochre) and "TODAY?" (neon). No logos. Check at 160 px. < 2 MB.

## 8. Publishing text
`04_publishing/EPxx_description.md`: title (formula), description (hook paragraph + comment question), chapters (shifted +1 s for the lead-in), Real Facts with sources, music credit block (CC BY), "Sound effects: original", "Narration: AI voice (ElevenLabs)", not-affiliated disclaimer for any brand, tags, upload settings (Education, not made for kids, end screen last 12 s, altered/synthetic: usually No).
Subtitles: `04_publishing/subtitles/` — build EN cues from the timing jsons (+1 s lead-in), translate to TR, write `.srt` (≤ 2 lines, ~42 chars), plus TR (and DE) title + description for YouTube's translation fields. See EP01 files as templates.

## 9. Shorts (research 23.11)
- `python3 03_engine/tools/shorts.py 01_episodes/EPxx/06_shorts/shortN.json out.mp4` → 1080×1920 from the 2K master: blurred background, keyframed camera window (`keys: [t, cx, cy, vw, dur]` in 1920×1080 coords; vw 1080 = square, > 1080 = wider/shorter window, < 1080 = zoom), 2-line hook header, 1–3-word captions, neon emphasis words, audio = episode mix.
- Rules: hook text from frame 1; end on the punchline (loop); no subscribe outro; 15–35 s; one idea; title = few words + one emoji; 2–3 hashtags; music credit; pinned comment question; Related video = the episode.
- Schedule used for EP01: long video + Short 1 same day, Short 2 next day, Short 3 the day after.

## 10. Publishing schedule
- EP01: uploaded Mon 23.11.2026 (+ Short 1). Short 2 Tue 24.11, Short 3 Wed 25.11.
- EP02 (car): upload **Thu 26.11.2026**. Target cadence: 2 long videos/week (bible).
