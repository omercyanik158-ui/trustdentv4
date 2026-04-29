# TrustDent Demo Konusma Metni (Teleprompter)

## Sunum Metni (ekrandan okuyarak anlatim)
- "Merhaba, ben [ismin]. 3 kisilik urun ekibimizin ekip lideriyim. Bu sunumda TrustDent'in mevcut ozelliklerini, canli calisan akislarini ve bir sonraki faz potansiyelini gosterecegim."
- "(Admin panelde `Demo Sifirla` butonuna bas.) Sunuma her seferinde temiz bir veri setiyle basliyoruz."
- "(Ana sayfayi goster.) Ilk olarak cok dilli vitrin deneyimini gosteriyorum. Site varsayilan Turkce aciliyor."
- "(Dil seciciden EN ve DE sec.) Tum ana iceriklerin locale'a gore degistigini canli gorebiliyoruz."
- "(Doktorlar sayfasini goster.) Burada filtre, siralama ve arama gercek calisiyor; liste anlik guncelleniyor."
- "(Klinikler bolumunu goster.) Klinik tarafinda da ayni sekilde lokasyon filtresi ve siralama aktif."
- "(Randevu modalini ac.) Simdi uc adimli randevu akisini gosteriyorum: tedavi secimi, tarih-saat secimi, iletisim bilgisi."
- "(Randevuyu tamamla.) Kayit olustuktan sonra akis panel tarafina aninda yansiyor."
- "(Hasta panelini goster.) Burada olusan randevuyu, durum rozetlerini ve arama filtrasyonunu gorebiliyoruz."
- "(Doktor panelini goster.) Doktor tarafinda Onayla / Iptal aksiyonlari canli calisiyor ve durumlar aninda degisiyor."
- "(Admin panelini goster.) Admin tarafinda Dashboard, Kullanicilar-Klinikler, Aktivite, Ayarlar sekmeleri aktif."
- "(Adminde bir satirda Incele'ye bas.) Incele aksiyonunda kaydin detay paneli aciliyor."
- "(Detay panelinde Onayla veya Reddet'e bas.) Moderasyon karari UI'da aninda isleniyor."
- "Bu noktada urunun demo katmaninda uctan uca calisan bir panel mimarisi sundugunu net olarak gormus oluyoruz."
- "Ekip olarak faz bazli ilerliyoruz: Faz 1 demo UX stabilizasyonu, Faz 2 API/DB/auth entegrasyonu, Faz 3 test-guvenlik-monitoring ve canliya alma hazirligi."
- "Ayni zamanda buyume tarafinda teknik SEO, icerik stratejisi, hiz optimizasyonu ve surekli analiz dongusunu paralel yurutecegiz."
- "Kapanis olarak: bugun gosterdigim surum backend'siz ama canli calisan bir demo. Bir sonraki adim, ayni UX'i canliya alma surecine uygun yapiya tasimak."

## Ne Zaman Biter? (gercekci cevap)
- "Demo katmani hazir; canliya alma hedefi icin gercekci aralik 8-12 hafta."
- "Auth + rol yetkilendirme: 1-2 hafta."
- "API + veritabani + migration: 2-3 hafta."
- "Panellerin gercek backend entegrasyonu: 2-3 hafta."
- "Test, guvenlik, monitoring, deploy ve canliya alma hazirligi: 2-4 hafta."
- "Kapsam revizyonu artisinda 12-16 hafta bandi daha guvenli."

## Sunum Oncesi Hizli Kontrol
- `http://localhost:3000` acik.
- `TR -> EN -> DE` gecisleri kontrol edildi.
- `Demo Sifirla` bir kez tiklandi.
- Sekmeler hazir: `/tr`, `/tr/patient`, `/tr/doctor`, `/tr/admin`.
