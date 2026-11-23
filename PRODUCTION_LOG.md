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
- [x] EP01 3. perde (22.11): scenes/ep01_act3.html → ep01_perde3_v1.mp4 (3:15). Gündüz kampı, kadro (şef/kuzen/nine/kardeş + kalabalık), Claude sohbet penceresi, Claude Code terminali + çizimler, toplantı tableti, sözlük kartları, su kaynatma diyagramı, patlama + Claude notu, sabun tarifi, çocuk hayatta kalma (gri ekran), bal + arılar, çetele kemiği, 1. yıl tacı, dinozor/devekuşu. Real Fact'ler: taşla kaynatma; ~4.800 yıllık sabun tarifi; avcı-toplayıcılarda çocukların ~%55–60'ı 15 yaşına ulaşırdı (Gurven & Kaplan 2007; Kaplan vd. 2000); bal; ~43.000 yıllık sayma kemiği; kuşlar = dinozor
- [x] EP01 4. perde (22.11, render bitti → ep01_perde4_v1.mp4, son 0,2 sn görüntü eksik, birleştirmede son kare uzatılacak): scenes/ep01_act4.html hazır (17 sahne: yazı, mağara kütüphanesi, okul, tarım+bedeli, komşular/sulama, oylama, 1.000 A.C., mamutlar, Neandertal, elektrik, ilk bilgisayar + Claude Code nasıl çalışır, ağ, ajan takımı + insan kontrolü, bedel: hata/ağ çöküşü/elle ateş, iyi taraf, Ay/Mars/tabela, müze). Render 3 parça (0–92, 92–184, 184–276.05) → birleştir + ses → 04_renders/ep01_perde4_v1.mp4 (render yarıda kaldıysa yeniden çalıştır)
- [x] EP01 5. perde: scenes/ep01_act5.html → ep01_perde5_v1.mp4 (1:53)
- [x] EP01 6. perde: scenes/ep01_act6.html → ep01_perde6_v1.mp4 (0:41)
- [x] Tüm perdeler arka arkaya: görüntü 705,0 sn = anlatım 705,0 sn (11:45), birebir oturuyor
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

## Senaryo revizyonu v3 (Buğra onayladı 22.11 — seslendirildi)
- 01_script/act4_v3_draft.txt: Claude Code'un nasıl çalıştığı (dosyaları okur, plan yapar, kodu yazar, terminalde testleri çalıştırır, hatayı okuyup düzeltir), 10.050 ilk ağ, 10.200 ajan takımı + insan kontrolü, bedel: hata bir gecede her yere yayılır / ağ çökünce kimse ateş yakamaz → "her çocuk elle ateş yakmayı öğrenir"; tarımın bedeli (daha çok iş, hastalık, toprak kavgası). Yer açmak için bazı cümleler kısaltıldı
- 01_script/act5_v3_draft.txt: "Do It Yourself" sınavı (yapay zekâ bağımlılığının bedeli)
- 22.11 ElevenLabs (Chrome, Sheldon, v4, 50/80): 4. perde 4.841 + 5. perde 1.898 karakter harcandı, kalan ~17.560. Her perdede 2. nesil seçildi (sessizlik/kesik/clip yok), atempo 0.95 + loudnorm
- Yeni süreler: P4 4:36, P5 1:53 → TOPLAM 11:45 (10–12 dk kuralı içinde)
- act4.txt / act5.txt artık v3; eski metinler act4_v2_old.txt / act5_v2_old.txt, eski sesler 02_audio/old_v2/. Tam metin: 01_script/narration_en_v3_final.txt; zamanlar yeniden çıkarıldı (ep01_timing.md)
- Ham çekimler: 02_audio/raw/act4_v3_gen1-2.mp3, act5_v3_gen1-2.mp3 (git dışı, PC'de)

## Müzik ve efekt planı (Buğra onayladı 22.11)
- Telifli şarkı ASLA, 1–3 saniye bile değil (YouTube: birkaç saniye de telif talebi doğurur)
- Komik/ikonik müzik: Kevin MacLeod (incompetech, CC BY 4.0) — Monkeys Spinning Monkeys, Sneaky Snitch, Fluffing a Duck vb.; açıklamaya kredi satırı
- Ana müzik yatağı: YouTube Studio Ses Kitaplığı (Attribution not required)
- Meme efektleri (boom, plak cızırtısı, korna, boing, cırcır böceği, ding...): YouTube Ses Kitaplığı + ElevenLabs ses efekti aracıyla kendi versiyonlarımız (Buğra'nın aboneliği)
- Amaç: güncel/modern internet dili, ama tamamen telifsiz

## KAYIT + EP02 BAŞLANGIÇ (23.11 14:30)
- Buğra: EP01 ve Short 1 yüklendi; Short 2 yarın (24.11), Short 3 çarşamba (25.11); EP02 Perşembe 26.11 yayınlanacak.
- Buğra: EP01'de yapılan her şey klasöre kaydedilsin → 00_docs/URETIM_REHBERI.md (adım adım üretim rehberi, komutlar, hatalar/dersler) + 00_docs/KANAL_KITABI.md (kanal kitabının klasör kopyası). CLAUDE.md bunlara yönlendiriyor.
- EP02 konusu: ARABA (EP01 sonunda söz verildiği gibi; kanal kitabındaki sıra değişti: telefon sonraya). Aynı başlık formülü, aynı içerik yapısı ve çizgi; DAHA FAZLA ABSÜRTLÜK: gerçek araba markaları, garip arabalar, uçan arabalar.
- Senaryo, ses (Buğra'nın ElevenLabs'i — "sana bırakıyorum" = EP02 anlatımı için onay), kurgu tamamen Claude'da.

## EP02 ARABA — SENARYO v1 (23.11 15:00)
- Araştırma: 01_episodes/EP02_Car/01_script/research.md (12 gerçek bilgi + kaynak: devekuşu ~70 km/sa, en eski tekerlek ~5.150 yıl, Benz 1886, Bertha Benz 1888 + eczane = ilk benzinlik, ilk trafik lambası 1868 Londra (patladı), ilk hız cezası 1896 (13 km/sa, sınırın 4 katı), yılda ~1,19 milyon trafik ölümü (WHO), ~1,5 milyar araba).
- Marka kararı (Claude): gerçek marka/kişi adları sadece gerçek bilgilerde düz yazı (Benz); logo yok; arabanın logosu ilk sahneden itibaren çamurla kaplı ve hep öyle kalıyor (running gag). Absürt uydurma markalar: Mammoth Motors, Rockswagen, Fer-rock-i, Ostrich Martin.
- Senaryo v1: 01_script/narration_en_v1.txt + act1..6.txt — 1.851 kelime, ~11.300 karakter, tahmini anlatım ~10:45 (sting+bitiş ile ~11:00).
- Önemli anlar: kırmızı araba + çamurlu logo; korna → herkes ağaçta; ilk kaza (tek ağaca); devekuşu yarışı (gerçek: 70 km/sa); bardaklık → ilk bardak; el kitabının resimleri → tekerlek (önce kare); 100 km = 2 saat → ilk ticaret; devekuşu arabası = "ilk dinozor güçlü araç"; ilk trafik sıkışıklığı; trafik lambası "Ug"; taş hız cezası; tapınaktaki 1.000 yıldır çalışan araba; metal, petrol + petrol savaşları; uydurma markalar + bacaklı/yüzen/mamutun ezdiği "üstü açık" araba; emniyet kemeri erken; uçan arabalar + gökyüzünde trafik; bugün: "After Vroom", devekuşu yarışı en büyük spor, mamutlar emekli, merhaba = korna, 41 yıllık trafik, yürümek ekstrem spor, direksiyon = "yuvarlak yılan". Bedeller: av sürüleri kaçar, yollar doğayı böler, petrol savaşları, duman, kazalar, toprağın üçte biri yol.
- Sonraki bölüm ipucu: oyun konsolu (kanal kitabı listesinden, en absürt aday).

## EP02 ARABA — SES + ANİMASYON + MİKS (23.11 15:45)
- Ses: Sheldon / v4 / 50-80, her perdede 2. nesil; atempo 0.95 + loudnorm. Süreler: P1 22.85, P2 55.8, P3 203.6, P4 255.05, P5 109.8, P6 42.92 sn. Toplam bölüm (1 sn giriş + jenerik + bitiş ekranı dahil) 11:45.6.
- Sahneler: 03_engine/scenes/ep02_act1..6.html (+ yeni kit: lib/kit_car.js — araba/varyantlar, tekerlek, el arabası, Ug trafik ışığı, taş levha, petrol kulesi, küre…). Jenerik = ep01_sting (genel), bitiş ekranı = ep02_endscreen ("Where would YOU drive first?").
- P4: 10. yıl → 100.000. yıl (kopya arabalar, devekuşu arabası, ilk trafik sıkışıklığı + mamut, iyi/kötü yollar, Ug trafik ışığı + Gerçek Bilgi 1868, 40 kg taş ceza + 1896, tapınak, kılavuzla okuma, metal/petrol/petrol savaşları, buharlı araba + Benz/Bertha, uydurma markalar + bacaklı/yüzen/mamutun ezdiği araba, şehirler + bedel + WHO 1,19 milyon, emniyet kemeri, uçan arabalar + gökyüzü trafiği, kendi kendini süren arabalar + müze 9.999.999 km, çamur hâlâ logoda).
- P5: "300.000 A.V. (After Vroom)" + 10 madde + bedel + "komşuydular". P6: ilk gece ceylan budu → müzede lastiğin yanında, devekuşu 0 yarış kaybı, yorum sorusu "ilk nereye giderdin?", sonraki bölüm: oyun konsolu (29 kişi, 1 kumanda), Abone ol.
- Efekt: sfx.py'ye kendi araba paketimiz eklendi (engine_start, vroom, amb_engine, passby, honk, honk_long, skid, crash, bonk, steam, squawk, trumpet, tweet, click) — tamamı sentez, lisans gerektirmez.
- Miks: 03_engine/tools/mix_ep02.py (19 müzik geçişi, 401 efekt, ortam sesi) → 1 sn giriş (amb_day -42 dB) → alimiter + 2 geçişli loudnorm → -14.1 LUFS, TP -1.5 (/tmp/ep02/mix_final_lead1s.wav).
- Thumbnail taslağı: brand.html?pkg=2&asset=thumb_ep02 (Paket 2 düzeni, B tarzı neon: solda You + kırmızı araba (far ışığı), sağda gece neon şehir + taş otoyolda araba kuyruğu + neon izli uçan arabalar) → 05_thumbnail/EP02_thumb_taslak.png — Buğra onayı bekliyor.
- Açıklama: 04_publishing/EP02_description.md (bölüm zamanları +1 sn, 9 Gerçek Bilgi + kaynak, müzik künyesi, araba markalarıyla bağlantısızlık notu). Başlık formülü: "What If You Had a Car 300,000 Years Ago?" — onay bekliyor.
- Altyazı: yeni araç 03_engine/tools/subs.py (zamanlama json'larından cue + EN/TR srt) → subtitles/EP02_en.srt, EP02_tr.srt (180 satır).
- 2K final: /tmp/hq2/run.sh + enc.sh (EP01 tarifinin aynısı; act1'e 30 karelik giriş).

## EP01 SHORTS (23.11 14:05) — HAZIR
- Araştırma (Shorts 2026): ilk 2–3 sn kaydırma oranı belirleyici; loop/yeniden izleme güçlü sinyal; cevap gelince bit, outro yok; Zack D. Films örneği (31 sn, "you" anlatımı). vidIQ bağlayıcısı önerildi (kanal verisi için), bağlanmadı → web araştırmasıyla devam.
- Araç: 03_engine/tools/shorts.py — 2K finalden 1080×1920: bulanık arka plan + kamera penceresi (keyframe pan/zoom) + üst merak başlığı (Archivo Black, 2. satır neon) + 1–3 kelimelik büyük altyazı (vurgu kelimeleri neon). Ses = bölüm miksi (müzik+efekt dahil), -14 LUFS.
- 3 Short: 1) "Cavemen Asked AI for Food 🔥" taşla kaynatma, 34,8 sn; 2) "The First Vote in History 🗳️" ilk oylama/recount, 26,9 sn; 3) "Caveman Asks AI About Dinosaurs 🦖" dinozor + devekuşu uzay programı, 17,6 sn (iki parçanın birleşimi, sonu başa bağlanıyor).
- Yükleme metinleri, müzik kredisi (CC BY zorunlu), sabit yorum, İlgili video = EP01: 06_shorts/README.md. mp4'ler git-ignore (PC'de var).

## EP01 ALTYAZI (23.11 13:50)
- Buğra: YouTube'a dosya olarak Türkçe altyazı ekleyelim → İngilizce (birebir senaryo) + Türkçe .srt hazırlandı: 04_publishing/subtitles/EP01_en.srt, EP01_tr.srt (309 satır, zamanlama hizalama json'larından, 2K final videoya göre +1 sn giriş dahil, son satır 11:47.9)
- Türkçe başlık + açıklama (YouTube "Başlık ve açıklama" çevirisi için) + yükleme adımları: subtitles/README_yukleme.md
- Türkçe başlık: "300.000 Yıl Önce Yapay Zekân Olsaydı Ne Olurdu?" — "A.C." → "C.S." (Claude'dan Sonra)
- Buğra Almanca başlık + açıklama istedi → README_yukleme.md'ye eklendi ("Was wäre, wenn du vor 300.000 Jahren KI gehabt hättest?"). Almanca .srt istenmedi (teklif edildi).
- Ek diller (İspanyolca, Portekizce, Hintçe) önerildi; Buğra henüz istemedi.

## EP01 BAŞLIK + THUMBNAIL (23.11 13:10)
- Buğra başlığı ONAYLADI: "What If You Had AI 300,000 Years Ago?"
- Thumbnail iki seçenek (05_thumbnail): A = onaylı Paket 2 referansının birebir aynısı; B = aynı düzen + yıldızlar, neon uçan-taş izleri, telefonda daha güçlü ışık. Logo yok, sadece "300,000 BC" ve "TODAY?". 160 px'te okunuyor.
- Buğra **B**'yi seçti → 05_thumbnail/EP01_thumbnail_FINAL.png. Sonraki bölümlerde de B tarzı (Paket 2 + bölüme özel neon ayrıntılar) kullanılacak.

## EP01 BAŞA 1 SN GİRİŞ (23.11 13:00)
- Buğra: birleştirilmiş videonun başında ~1 sn ses yok, "Three" duyulmuyor
- Teşhis: dosyada ses tam ("Three" 0,1. sn'de başlıyordu); anlatım videonun ilk anında başladığı için oynatıcı/ses kartı açılırken ilk kelimeyi yutuyor. YouTube'da da risk.
- Çözüm: başa 1 sn (30 kare) giriş eklendi; ilk kare duruyor, gece/ateş ambiyansı 0,8 sn'de yumuşakça açılıyor, anlatım 1,1. sn'de başlıyor. Süre 11:59.8, -14.0 LUFS, senkron korunuyor (5 noktada kontrol). Act1 kayıpsız parçadan tek sefer yeniden kodlandı, diğer perdeler aynen (-c copy).
- Yeni ses: /tmp/full/mix_final_lead1s.wav. md5 f36f42bfa8e9abdcb40ffe807e511d22, 817.931.260 bayt
- Açıklamadaki bölüm zamanları +1 sn kaydırıldı (0:27, 1:23, 4:38, 6:31, 7:25, 8:23, 8:54, 9:14, 11:07); bitiş ekranı 11:48–12:00
- KURAL (sonraki bölümler): anlatım hiçbir zaman 0. saniyede başlamasın, en az 1 sn giriş olsun.

## EP01 2K ÜST KALİTE RENDER (22.11 23:30 → 23.11 02:10, TAMAMLANDI)
- Karar (Buğra onayı): final video 2560×1440 (2K) olarak yeniden çizilecek; içerik/kurgu/ses aynı, sadece netlik
- Neden: ilk master ~3 Mbps ve iki kez sıkıştırılmıştı; YouTube 1440p yüklemeleri daha yüksek kaliteli işliyor (1080p izleyene de daha net)
- Yöntem: render.mjs'e --cap/--jq/--qp/--preset seçenekleri eklendi. Kareler JPEG kalite 100 (PNG 2K'da çok yavaştı, ~2.8 fps) → kayıpsız ara dosya (x264 qp 0) → tek seferlik final kodlama (preset slow, ~16–20 Mbps), ses AAC 384k
- HATA BULUNDU (00:40): sahneler 1920×1080 sabit ölçülerle tasarlandığı için doğrudan 2560 pencerede açınca düzen bozuldu (bitiş ekranı, 3. perde vb.). O dosya teslim edilmedi, silindi.
- ÇÖZÜM: render.mjs --dsf 1.3333333333 → sahne 1920×1080 düzende açılır, kare 4/3 yoğunlukla 2560×1440 yeniden çizilir (büyütme değil; netlik testi 2 kat keskin). Tüm perdeler bu yöntemle yeniden çekiliyor.
- SONUÇ: 04_renders/EP01_FINAL_2K_What_If_You_Had_AI_300000_Years_Ago.mp4 — 2560×1440 30fps, H.264 CRF14 (tek kayıplı kodlama), ort. ~8.8 Mbps video (düz çizim stili az veri ister; kaliteyi CRF belirliyor) + AAC 384k, 11:58.8, -14.0 LUFS. 14 noktada eski onaylı videoyla karşılaştırıldı: düzen birebir aynı. md5 cbb6d9760ef76c634c462cba3dd99b66, 818.058.437 bayt
- Teslim: 780 MB, sohbet (500 MB) ve PC kopyalama (400 MB) sınırını aşıyor → birebir 3 parçaya bölündü (EP01_2K_00/01/02.part) + EP01_2K_BIRLESTIR.bat (Windows copy /b) PC'de 04_renders klasörüne kondu. Buğra .bat'a çift tıklayınca tam dosya oluşur. YouTube'a bu yüklenecek.
- Sürücü: /tmp/hq/run.sh (50 sn'lik parçalar, kaldığı yerden devam eder); kodlayıcı /tmp/hq/enc.sh (her perde bir kez: x264 medium, tune animation, CRF 14). Final birleştirme eski kare sayılarıyla (736,45,1680,5858,8283,3380,1223,360) + /tmp/full/mix_final.wav

## EP01 FİNAL KURGU (22.11 ~22:50) — teslim edildi
- Dosya: 04_renders/EP01_FINAL_What_If_You_Had_AI_300000_Years_Ago.mp4 — 11:58.8, 1920×1080 30fps H.264 CRF18, AAC 320k, -14.0 LUFS, tepe -1.2 dBFS
- Akış: Perde 1 (kanca) → 1,5 sn kanal jeneriği (kancadan SONRA; araştırma: başta uzun marka girişi izleyici kaçırır) → Perde 2–6 → 12 sn bitiş ekranı (YouTube öğeleri için son 5–20 sn)
- Ses: anlatım + 14 müzik geçişi (Kevin MacLeod, anlatım sırasında otomatik kısılma/ducking, konuşma altında ~-18 dB) + 329 ses efekti (kendi ürettiğimiz, 03_engine/tools/sfx.py → 02_library/audio/sfx) + gece/gündüz ortam sesi. Miks: 03_engine/tools/mix_ep01.py
- Düzeltilen: perde videoları ile sesler arasında 17 karelik kayma (görüntü esas alınarak sıfırlandı); 4. perdenin eksik son 0,2 sn'si son kare uzatılarak kapatıldı
- Yükleme metni: 04_publishing/EP01_description.md (başlık önerisi, bölüm zamanları, Real Fact kaynakları, müzik künyesi, Anthropic ile bağlantısızlık notu, etiketler, yükleme ayarları)
- Sıradaki: thumbnail (Paket 2 dili), Shorts 9:16 özetleri, başlık onayı

## KALDIĞIM YER (22.11 ~22:45, tamamlandı)
- Müzik seçildi (Kevin MacLeod, incompetech, CC BY 4.0): Investigations (P1–P2 merak), Monkeys Spinning Monkeys (P3 komedi), Sneaky Snitch (sinsi/komik anlar), Fluffing a Duck (P4 montaj), Cipher2 (Claude Code/teknoloji dönemi), Wholesome (P5 sonu + P6 kapanış)
- SORUN: Chrome'dan otomatik indirme engellendi (incompetech için 'birden fazla dosya indirme' izni). Buğra'dan izin/indirme istendi. Dosyalar Downloads'a SAU_music_KevinMacLeod_*.mp3 adıyla gelmeli
- Sonra: efektler (ElevenLabs Sound Effects), miks (anlatım -16 LUFS, müzik ~-28 LUFS altta, ducking), tam bölüm render

## ESKİ NOT (22.11 ~21:00)
1. 4. perde render: `cd 03_engine; node render.mjs scenes/ep01_act4.html /tmp/r4/a.mp4 --from 0 --to 92` (b: 92–184, c: 184–276.05), sonra concat + `02_audio/ep01_perde4.mp3` → `04_renders/ep01_perde4_v1.mp4`
2. 5. perde (112.65 sn, 2 parça) ve 6. perde (40.75 sn) render + ses
3. Önizlemeleri Buğra'ya gönder, PC'ye kopyala (device_commit_files), GitHub'a kaydet
4. Müzik/efekt topla ve miks → tam bölüm 11:45, sonra thumbnail, açıklama, Shorts

## Sıradaki adım (yeni sohbette buradan devam)
1. 3. perdeyi canlandır (zamanlar 01_script/ep01_timing.md), sonra 4, 5, 6
2. Müzik/efekt topla (Kevin MacLeod + YouTube Ses Kitaplığı + ElevenLabs efektleri) → 02_library/audio, ses miksi
3. Birleştirme, thumbnail, açıklama, Shorts
3. Render: `cd 03_engine && node render.mjs scenes/ep01_actN.html ../01_episodes/EP01_Claude/04_renders/ep01_perdeN_v1.mp4 --audio ../01_episodes/EP01_Claude/02_audio/ep01_perdeN.mp3` (~100 sn / 25 sn video)
Not: Üretim claude.ai sohbetlerinde sürüyor (Claude Code değil). Her adım sonrası GitHub'a kaydet.
