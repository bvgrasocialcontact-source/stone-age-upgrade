# Stone Age Upgrade — Yapım Günlüğü
Sahip: Buğra · Yapımcı/editör/tasarımcı: Claude
Ana kaynaklar: Kanal kitabı (https://claude.ai/artifact/WXpRa7MQMyLhuKh7qzBb7h) · EP01 senaryosu (https://claude.ai/artifact/UVPoTftYUhcbTGogd6FLoZ)

## Kesin kararlar
- Kanal: Stone Age Upgrade (YouTube kanalı açıldı; @stoneageupgrade alınmıştı, alternatifler: @thestoneageupgrade, @stoneageupgradetv, @stoneage_upgrade)
- Dönem: her bölüm ~300.000 yıl önce; sabit ülke/bölge yok
- Anlatım: 2. tekil şahıs ("you"), anlatıcı Born in Lore tarzı; karakter konuşmaz
- Karakter: You, A seçeneği (perçem), Stil 1 (el çizimi, titrek kontür, sabit kâğıt dokusu)
- Dinozor şakası: "no dinosaurs... technically one" → devekuşu
- Format: uzun video 16:9 1080p, en az 10 dk (Buğra 22.11), en fazla 12 dk; 9:16 sadece Shorts/Reels/TikTok özetleri
- Görseller: banner P3, profil P3 (panodakiyle birebir), thumbnail dili P2 (300,000 BC / TODAY?)
- Başlık formülü: "What If You Had [X] 300,000 Years Ago?"
- Seçilen tasarımlar sorulmadan değiştirilmez

## Araçlar
- Kendi motorumuz (03_engine): Chrome + ffmpeg + rough.js + d3, ~10 kare/sn, CRF 20; render Claude'un bulut ortamında
- Ses: Buğra'nın kendi ElevenLabs aboneliği (Higgsfield kredisi sesle harcanmaz). Claude, Chrome eklentisiyle ElevenLabs'ta üretir
- ANLATICI (sabit): ElevenLabs Voice Library "Sheldon - Quirky, Clever, Enthusiastic" (Amerikan; Seslerim'e eklendi), model Eleven v4, kararlılık 50 / benzerlik 80, otomatik etiketleme kapalı
- Ses işleme: her perde 2 çekim üretilir, teknik olarak temiz olan seçilir (varsayılan 2. nesil); ffmpeg atempo=0.95 (+%5 yavaş), loudnorm -16 LUFS / TP -1.5, 48 kHz 192k mp3; ham çekimler 02_audio/raw
- Flow (Chrome'daki Claude eklentisiyle, PRO hesap girişli — 22.11 kontrol edildi): sadece temsili/gerçekçi planlar, her üretimden önce onay; 720p indir, 1080p'ye büyüt
- Higgsfield: yedek

## Durum
- [x] Kanal kitabı, klasör yapısı, motor, karakter rig, hayvan seti, marka paketleri
- [x] EP01 senaryosu + ElevenLabs metni (01_script/ep01_elevenlabs.txt)
- [ ] EP01 başlık onayı (önerilen: What If You Had AI 300,000 Years Ago?)
- [x] EP01 senaryosu genişletildi (1.785 kelime; yeni sahneler: ekran/ateş, bal, sayma kemiği, ilk oylama, Bugün 8–10, yorum sorusu) → 01_script/narration_en_v2_final.txt
- [x] EP01 sesi (22.11): 6 perde, toplam 11:02 → 02_audio/ep01_perde1..6.mp3 + EP01_anlatim_tamami_onizleme.mp3
- [ ] EP01 Flow planları (onay bekliyor, 01_script/ep01_flow_shots.md)
- [x] EP01 oyuncu kadrosu (şef, kuzen, nine, Neandertal) — 03_assets/cast_ep01.png
- [x] EP01 zaman çizelgesi (22.11): sesteki sessizliklerden ifade zamanları → 02_audio/ep01_perdeN.timing.json + 01_script/ep01_timing.md (araç: 03_engine/tools/align.py, ASR gerekmez)
- [x] EP01 kit (22.11): 03_engine/lib/kit.js — gece kampı, kamp ateşi + kıvılcım, karanlık/ışık maskesi, telefon yakın planı, neon taş şehir (TODAY?), yıl paneli, durum paneli, Real Fact kartı, neon etiket, soru balonu, PROBLEMS damgası, neon ikonlar
- [x] EP01 1. perde animasyonu (22.11): 03_engine/scenes/ep01_act1.html → 04_renders/ep01_perde1_v1.mp4 (0:24, sesli) Buğra'ya gönderildi, onay bekliyor
- [ ] EP01 2–6. perde animasyonları
- [x] GitHub deposu kuruldu (22.11): github.com/bvgrasocialcontact-source/stone-age-upgrade (gizli). CLAUDE.md devir dosyası, taşınabilir motor (env.mjs, vendor/rough.js, fonts/). Telefondan Claude Code veya bu sohbetten devam edilebilir
- [ ] EP01 render, thumbnail, açıklama, Shorts özeti

## Küçük kararlar (Claude, 22.11)
- Senaryo dokümanındaki "PROBLEMS: 3" sayacı → "PROBLEMS: 4" (2. perdede artık 4 sorun var)
- Real Fact kartında ülke adı yok: "The oldest known Homo sapiens fossils are ~300,000 years old."
- HUD'a "CAMPFIRE %" (sönen ateş) ve "PHONE BATTERY %" eklendi; pil 2. perdedeki pil sorununa zemin hazırlıyor
- Telefon ekranı: jenerik yıldız işareti, logo yok; durum çubuğunda "No service" (internet sorununa zemin)
- 1. perde sırası: uyuyan You → zıplayıp kalkar → elinde telefon → ekran yakın planı (yazı daktiloyla) → "CLAUDE / an AI assistant" etiketi → ikonlar kafasına çarpar + soru balonu → 1 cümlelik neon taş şehir flaşı (TODAY?) → fısıltıda yüz yakın planı → PROBLEMS: 4 damgası
- Müzik/efekt henüz yok; tüm perdeler bitince ses miksinde eklenecek

## Sıradaki adım (yeni sohbette buradan devam)
1. Buğra'nın 1. perde geri bildirimini uygula (onaylarsa aynı stille devam)
2. 2. perdeyi canlandır (senaryo sahne 6–11; zamanlar 01_script/ep01_timing.md), sonra 3–6
3. Render: `cd 03_engine && node render.mjs scenes/ep01_actN.html ../01_episodes/EP01_Claude/04_renders/ep01_perdeN_v1.mp4 --audio ../01_episodes/EP01_Claude/02_audio/ep01_perdeN.mp3` (~100 sn / 25 sn video)
Not: Üretim claude.ai sohbetlerinde sürüyor (Claude Code değil). Her adım sonrası GitHub'a kaydet.
