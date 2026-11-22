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
- [x] EP01 1. perde animasyonu (22.11) onaylandı; Claude stiline göre güncellendi → ep01_perde1_v2.mp4
- [x] EP01 2. perde animasyonu (22.11): scenes/ep01_act2.html → ep01_perde2_v2.mp4 (pil/taş, internet bölünmüş ekran, İngilizce geri sayım, kibar ateş, Claude güncellemesi + patch notes, dinozor X + devekuşu)
- [ ] EP01 3. perde (ses değişmiyor, sıradaki)
- [ ] EP01 4–5. perde: yeni metin onayı + yeniden seslendirme sonrası
- [ ] EP01 6. perde
- PC senkronu: Desktop\StoneAgeUpgrade masaüstü uygulamasıyla bağlandı; her adımda dosyalar oraya da yazılır
- [x] GitHub deposu kuruldu (22.11): github.com/bvgrasocialcontact-source/stone-age-upgrade (gizli). CLAUDE.md devir dosyası, taşınabilir motor (env.mjs, vendor/rough.js, fonts/). Telefondan Claude Code veya bu sohbetten devam edilebilir
- [ ] EP01 render, thumbnail, açıklama, Shorts özeti

## Küçük kararlar (Claude, 22.11)
- Senaryo dokümanındaki "PROBLEMS: 3" sayacı → "PROBLEMS: 4" (2. perdede artık 4 sorun var)
- Real Fact kartında ülke adı yok: "The oldest known Homo sapiens fossils are ~300,000 years old."
- HUD'a "CAMPFIRE %" (sönen ateş) ve "PHONE BATTERY %" eklendi; pil 2. perdedeki pil sorununa zemin hazırlıyor
- Telefon ekranı: jenerik yıldız işareti, logo yok; durum çubuğunda "No service" (internet sorununa zemin)
- 1. perde sırası: uyuyan You → zıplayıp kalkar → elinde telefon → ekran yakın planı (yazı daktiloyla) → "CLAUDE / an AI assistant" etiketi → ikonlar kafasına çarpar + soru balonu → 1 cümlelik neon taş şehir flaşı (TODAY?) → fısıltıda yüz yakın planı → PROBLEMS: 4 damgası
- Müzik/efekt henüz yok; tüm perdeler bitince ses miksinde eklenecek

## Marka / telif kararları (22.11, Buğra'nın isteğiyle araştırıldı)
- Claude LOGOSU kullanılmaz: Anthropic marka kuralları logonun yalnızca önceden onayla kullanılabileceğini söylüyor (anthropic.com/legal/trademark-guidelines). İzin istenirse: marketing@anthropic.com
- Claude ve Claude Code İSİMLERİ anlatımda, başlıkta ve ekranda düz yazı olarak kullanılır (ürünü adıyla anmak). Logo benzeri yıldız/patlama işareti çizilmez
- Açıklamaya not: "Not affiliated with or endorsed by Anthropic. Claude is a trademark of Anthropic, PBC."
- Claude'a ait her şey Claude'un renkleri ve havasıyla: turuncu #D97757, krem #FAF9F5, koyu #141413, tırnaklı yazı Lora (OFL) + Poppins (OFL) → kit.js SAU.CL. Telefon uygulaması, "Claude" etiketi, güncelleme bildirimi, patch notes, Claude Code terminali bu stilde
- Kanalın kendi göstergeleri (yıl paneli, HUD, TODAY? dünyası) kanalın neon mavisi #3DF5FF ile kalır
- Müzik: sadece YouTube Studio Ses Kitaplığı (Content ID talebi gelmez), "Attribution not required" filtresi; popüler/telifli şarkı kullanılmaz. Diğer uygulama/marka logoları da aynı kural: isim serbest, logo sadece markanın açık izniyle
- Senaryo kuralı (Buğra): değişimler anlatılırken yararları VE zararları birlikte anlatılır

## Senaryo revizyonu (taslak, onay bekliyor)
- 01_script/act4_v3_draft.txt: Claude Code'un nasıl çalıştığı (dosyaları okur, plan yapar, kodu yazar, terminalde testleri çalıştırır, hatayı okuyup düzeltir), 10.050 ilk ağ, 10.200 ajan takımı + insan kontrolü, bedel: hata bir gecede her yere yayılır / ağ çökünce kimse ateş yakamaz → "her çocuk elle ateş yakmayı öğrenir"; tarımın bedeli (daha çok iş, hastalık, toprak kavgası). Yer açmak için bazı cümleler kısaltıldı
- 01_script/act5_v3_draft.txt: "Do It Yourself" sınavı (yapay zekâ bağımlılığının bedeli)
- Tahmini toplam süre ~11:50. 4. ve 5. perde ElevenLabs'te yeniden seslendirilecek → Buğra'nın kredi onayı gerekli

## Sıradaki adım (yeni sohbette buradan devam)
1. Buğra'nın 2. perde (Claude stili) geri bildirimi + 4–5. perde metin/kredi onayı
2. 3. perdeyi canlandır (zamanlar 01_script/ep01_timing.md); onaydan sonra 4–5'i yeniden seslendir (ElevenLabs, Sheldon, v4), align.py ile yeni zamanları çıkar, sonra 4–6
3. Render: `cd 03_engine && node render.mjs scenes/ep01_actN.html ../01_episodes/EP01_Claude/04_renders/ep01_perdeN_v1.mp4 --audio ../01_episodes/EP01_Claude/02_audio/ep01_perdeN.mp3` (~100 sn / 25 sn video)
Not: Üretim claude.ai sohbetlerinde sürüyor (Claude Code değil). Her adım sonrası GitHub'a kaydet.
