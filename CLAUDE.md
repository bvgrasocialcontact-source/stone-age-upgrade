# Stone Age Upgrade — CLAUDE.md (read this first, every session)

You are continuing a production that started in a claude.ai chat. Everything you need is in this folder.
**Talk to the owner in Turkish.** He (Buğra) does not speak English. Keep replies short and plain; he is often on his phone.

## Roles
- Buğra = channel owner. Claude = producer, moderator, editor, designer, researcher. You make decisions within his wishes and keep everything stable and consistent across episodes.
- Never forget decisions. Log every decision and step in `PRODUCTION_LOG.md` (Turkish) as you go.
- **Brand/IP rules (decided 22.11):** NO Claude/Anthropic logo (Anthropic trademark guidelines need prior approval). Names "Claude"/"Claude Code" OK as plain text. Claude-related visuals use Claude's colours/feel: orange #D97757, cream #FAF9F5, dark #141413, Lora + Poppins (`SAU.CL` in kit.js). Channel HUD stays neon cyan. Music only from YouTube Studio Audio Library ("Attribution not required"). Description gets a not-affiliated disclaimer. Script must show BOTH benefits and costs of each change.
- **Never alter a design he has chosen** (banner, profile picture, thumbnail language, character). Reproduce exactly. Ask before any visual identity change.
- Never spend paid credits (Flow, Higgsfield, ElevenLabs) without his explicit OK in chat. Voice is made with HIS ElevenLabs subscription, not Higgsfield.

## The channel
- English YouTube channel **Stone Age Upgrade**: "What if you had today's tech ~300,000 years ago?"
- Second-person narration ("you"). Main character is called **You** (option A: messy hair tuft), drawn in **Style 1** (hand-drawn, rough.js line boil, static paper texture). The character never speaks; only the narrator.
- Same era every episode (~300,000 years ago), **no fixed country/region**. Animals vary per episode (gazelle, zebra, wildebeest, hare, ostrich…). Running gag: "no dinosaurs… technically one" → the ostrich.
- Tone: info-heavy + funny; absurd moments + "that actually makes sense" moments; constantly changing on-screen numbers/dates (HUD); the world evolves in proportion to the topic. Real facts appear on "Real Fact" cards, sources go in the description.
- Format: long videos **16:9, 1920×1080, 30 fps, minimum 10 min, maximum 12 min**. 9:16 only for Shorts/Reels/TikTok summaries.
- Title formula: "What If You Had [X] 300,000 Years Ago?" (EP01: "What If You Had AI 300,000 Years Ago?" — APPROVED 23.11).
- Brand: banner = package 3, profile = package 3 exactly as on the board, thumbnail language = package 2 (before/after split "300,000 BC" vs "TODAY?"). Finals in `00_brand/final/` (+ rules README).
- Palette: ink #1E1612, earth #3B2418, ochre #C8763A, rust #9E4A26, sand #E8C48A, bone #F3E6CF, tech neon #3DF5FF, techDeep #0E6F7A.
- Fonts (bundled in `03_engine/fonts`, OFL): Archivo Black (display), Inter (UI), Anonymous Pro (mono/HUD), Comic Relief (handwritten).

## Narrator (fixed for all episodes)
- ElevenLabs Voice Library: **"Sheldon - Quirky, Clever, Enthusiastic"** (American), already in his "My Voices". Model **Eleven v4**, stability 50, similarity 80, do NOT press auto-tag. Audio tags like [excited] [deadpan] [whispers] [short pause] work.
- Per act: generate (ElevenLabs gives 2 takes), pick the technically clean one (default take 2), then
  `ffmpeg -i in.mp3 -af "atempo=0.95,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" -c:a libmp3lame -b:a 192k out.mp3`.
- He generates nothing himself now; Claude drives ElevenLabs (browser) and checks the result objectively (duration, silences, loudness).

## Folder map
- `00_brand/` finals, packages P1–P3, style tests
- `01_episodes/EP01_Claude/` → `01_script` (narration_en_v2_final.txt = final English text, act1..6.txt per act, ep01_flow_shots.md), `02_audio` (ep01_perde1..6.mp3 final; raw takes + full preview only on the PC, git-ignored), `03_assets` (cast_ep01.png), `04_renders`, `05_thumbnail`, `06_shorts`
- `02_library/` reusable characters/animals/backgrounds/props/audio
- `03_engine/` our renderer (see below)
- `04_publishing/` descriptions, upload metadata
- Docs (claude.ai): Channel bible https://claude.ai/artifact/WXpRa7MQMyLhuKh7qzBb7h · EP01 script (Turkish, scene-by-scene visuals + HUD, Real Fact sources, description template) https://claude.ai/artifact/UVPoTftYUhcbTGogd6FLoZ — if you can't open them, ask him to paste or export them.

## Render engine (03_engine)
- Scenes are HTML/SVG pages driven by `window.SAU` (lib/sau.js: `SAU.init(fn)`, `SAU.seek(t)`, `SAU.ready`, easing `E`, `p(t,a,b,ease)`, `boil()` line boil, `noiseURL()` paper texture). `lib/pen.js` rough pen, `lib/you.js` rigged You (`SAU.makeYou(parent, rc, o).pose(p,t)`: armL/armR/legL/legR/head/bob/expr/blink/look/holding), `lib/animals.js`, `lib/characters.js`. rough.js is vendored in `vendor/`, fonts load from `fonts/fonts.css` (every scene links it).
- `render.mjs <scene.html> <out.mp4> [--w 1920 --h 1080 --fps 30 --from 0 --to <sec> --audio file --crf 20]`: Playwright seeks every frame, CDP JPEG → ffmpeg (libx264, veryfast). `still.mjs <scene> <out.png> [--t sec --q "k=v"]`. `env.mjs` finds Playwright + Chrome on Linux or Windows (`CHROME_PATH` env overrides).
- Setup on a new machine: `cd 03_engine && npm i playwright-core` (+ Chrome or `npx playwright install chromium`) and ffmpeg. On Buğra's Windows PC ask before `winget install OpenJS.NodeJS.LTS` / `winget install Gyan.FFmpeg`.
- Speed ≈10 fps on 2 cores. Render per act/scene in chunks (<10 min per command), then concat. Renders (`04_renders/*.mp4`) are git-ignored (GitHub 100 MB limit) — deliver them as files, not commits.
- Repo: github.com/bvgrasocialcontact-source/stone-age-upgrade (should be private — GitHub showed it public on 22.11; he was told how to switch). Also mirror changed files to his PC folder `C:\Users\BUĞRA\Desktop\StoneAgeUpgrade` via the desktop app (device_commit_files) whenever it is connected. Commit + push after every meaningful step so any session (claude.ai chat, Claude Code web/phone, PC) can continue.

## EP01 — Claude & Claude Code — status
- Done: script v3 (`01_script/narration_en_v3_final.txt`; acts 4–5 rewritten 22.11 with Claude Code detail + costs/benefits), narration audio 11:45 total (P1 0:25, P2 0:56, P3 3:15, P4 4:36, P5 1:53, P6 0:41), brand, cast sheet, acts 1–2 animated (`scenes/ep01_act1.html`, `ep01_act2.html`).
- Music/SFX plan (approved): Kevin MacLeod CC-BY comedy tracks (credit in description) + YouTube Studio Audio Library + our own meme-style SFX generated in his ElevenLabs. Never copyrighted songs, not even 1–3 s.
- Next, in order:
  1. (Done in cloud) engine is portable; on the PC just install deps.
  2. (Done 22.11) Phrase timings from pauses: `02_audio/ep01_perdeN.timing.json`, sheet `01_script/ep01_timing.md` (tool `03_engine/tools/align.py`).
  3. (Started 22.11 — `03_engine/lib/kit.js`; extend per act) EP01 background + prop + HUD kit (campfire camp, savanna, cave library, village, fields, mud-brick house, computer room, Moon, Mars, museum; HUD: year counter, population, "Claude Code" panel, Real Fact card).
  4. (Acts 1–2 done & approved; next act 3) Animate act by act, render per act, then assemble with audio + music/SFX beats (keep total 10–12 min). Send him short previews to approve.
  5. Optional Flow shots (scene 7 data center, scene 21 stone boiling, scene 44 Moon footprint) — only after his approval of credits.
  6. Thumbnail (package-2 language), description (template in the script doc, Real Fact sources), Shorts summary 9:16.
- FINAL CUT DONE 22.11: `04_renders/EP01_FINAL_What_If_You_Had_AI_300000_Years_Ago.mp4` (11:58.8, -14 LUFS). Rebuild: render acts + `scenes/ep01_sting.html` + `ep01_endscreen.html`, `python3 03_engine/tools/sfx.py 02_library/audio/sfx`, `python3 03_engine/tools/mix_ep01.py`, then loudnorm + concat (see PRODUCTION_LOG). Upload text: `04_publishing/EP01_description.md`.
- 2K MASTER DONE 23.11: `04_renders/EP01_FINAL_2K_What_If_You_Had_AI_300000_Years_Ago.mp4` (2560×1440, CRF14, AAC 384k) — upload THIS one. Rebuild: render each scene with `--w 1920 --h 1080 --dsf 1.3333333333 --jq 100 --qp 0 --preset ultrafast` (never --w 2560: scenes are laid out in 1080p px), encode each act once (x264 medium, tune animation, CRF 14, same frame counts), concat -c copy + mix_final_lead1s.wav (act1 gets a 30-frame clone lead-in: `tpad=start=30:start_mode=clone`; total 11:59.8). Rule: narration never starts at 0 s — always ≥1 s lead-in (players swallow the first word). Files >400 MB go to the PC as byte-split .part files + a `copy /b` .bat.
- Thumbnail 23.11: A (exact reference) / B (+ stars, neon trails, stronger phone glow) in 05_thumbnail, `brand.html?pkg=2&asset=thumb|thumb_ep01` at 1280×720 — awaiting his pick.
- Open: thumbnail pick; Shorts; Flow approval (optional).
