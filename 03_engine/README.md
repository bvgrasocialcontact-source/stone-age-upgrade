# Stone Age Upgrade — Animasyon Motoru (yedek)

Render bulut ortamında yapılır; bu klasör kaynak kodun yedeğidir.

- render.mjs        Sahne (HTML/SVG) → kare kare Chrome render → ffmpeg → MP4 (1080p, 30fps)
- lib/sau.js        Ortak araçlar: marka renkleri/fontları, easing, el çizimi "line boil" (rough.js), doku, sayaç formatları
- scenes/           Sahne dosyaları
- test/             Motor testleri (16:9 YouTube ve 9:16 Shorts aynı sahneden)

Kullanım: node render.mjs scenes/<sahne>.html out.mp4 --w 1920 --h 1080 [--audio anlatim.mp3]
Dikey (Shorts/Reels/TikTok): --w 1080 --h 1920
Hız: ~10 kare/sn → 10 dakikalık bölüm ≈ 30 dk render.
Dosya boyutu: statik kâğıt dokusu + CRF 20 → 10 dk ≈ 120–150 MB (hareketli film greni 1,8 GB yapıyordu, kaldırıldı).
still.mjs: tek kare PNG (thumbnail, stil testi, karakter sayfası).
