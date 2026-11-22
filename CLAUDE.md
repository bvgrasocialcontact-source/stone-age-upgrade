# Stone Age Upgrade — CLAUDE.md (read this first, every session)

You are continuing a production that started in a claude.ai chat. Everything you need is in this folder.
**Talk to the owner in Turkish.** He (Buğra) does not speak English. Keep replies short and plain; he is often on his phone.

## Roles
- Buğra = channel owner. Claude = producer, moderator, editor, designer, researcher. You make decisions within his wishes and keep everything stable and consistent across episodes.
- Never forget decisions. Log every decision and step in `PRODUCTION_LOG.md` (Turkish) as you go.
- **Never alter a design he has chosen** (banner, profile picture, thumbnail language, character). Reproduce exactly. Ask before any visual identity change.
- Never spend paid credits (Flow, Higgsfield, ElevenLabs) without his explicit OK in chat. Voice is made with HIS ElevenLabs subscription, not Higgsfield.

## The channel
- English YouTube channel **Stone Age Upgrade**: "What if you had today's tech ~300,000 years ago?"
- Second-person narration ("you"). Main character is called **You** (option A: messy hair tuft), drawn in **Style 1** (hand-drawn, rough.js line boil, static paper texture). The character never speaks; only the narrator.
- Same era every episode (~300,000 years ago), **no fixed country/region**. Animals vary per episode (gazelle, zebra, wildebeest, hare, ostrich…). Running gag: "no dinosaurs… technically one" → the ostrich.
- Tone: info-heavy + funny; absurd moments + "that actually makes sense" moments; constantly changing on-screen numbers/dates (HUD); the world evolves in proportion to the topic. Real facts appear on "Real Fact" cards, sources go in the description.
- Format: long videos **16:9, 1920×1080, 30 fps, minimum 10 min, maximum 12 min**. 9:16 only for Shorts/Reels/TikTok summaries.
- Title formula: "What If You Had [X] 300,000 Years Ago?" (EP01 pick: "What If You Had AI 300,000 Years Ago?" — still awaiting his final OK).
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
- Repo: github.com/bvgrasocialcontact-source/stone-age-upgrade (private). Commit + push after every meaningful step so any session (claude.ai chat, Claude Code web/phone, PC) can continue.

## EP01 — Claude & Claude Code — status
- Done: script (6 acts, 1,785 words), narration audio (11:02 total: P1 0:25, P2 0:56, P3 3:15, P4 3:57, P5 1:44, P6 0:41), brand, cast sheet.
- Next, in order:
  1. (Done in cloud) engine is portable; on the PC just install deps.
  2. Word-level timestamps for each act (ElevenLabs Speech-to-Text in his browser, or local whisper) → `02_audio/ep01_perdeN.words.json`; build a scene timing sheet from them.
  3. EP01 background + prop + HUD kit (campfire camp, savanna, cave library, village, fields, mud-brick house, computer room, Moon, Mars, museum; HUD: year counter, population, "Claude Code" panel, Real Fact card).
  4. Animate act by act, render per act, then assemble with audio + music/SFX beats (keep total 10–12 min). Send him short previews to approve.
  5. Optional Flow shots (scene 7 data center, scene 21 stone boiling, scene 44 Moon footprint) — only after his approval of credits.
  6. Thumbnail (package-2 language), description (template in the script doc, Real Fact sources), Shorts summary 9:16.
- Open: title confirmation; Flow approval.
