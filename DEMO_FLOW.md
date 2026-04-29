# TrustDent Demo Akisi (4-5 Dakika)

## 0) Demo Sifirla ve Baslat (15 sn)
- Panel header'daki `Demo Sifirla` butonuna bas.
- Bu adim her sunumda ayni temiz veriyi getirir (seed data).
- Ardindan ana sayfaya don: `http://localhost:3000`.

## 1) Locale ve Vitrin Kalitesi (35 sn)
- Uygulamanin varsayilan olarak Turkce acildigini goster.
- Dil seciciden `EN` ve `DE` secip 1-2 bolumde canli gecis goster.
- Mesaj: "Tek kod tabaniyla cok dilli vitrin deneyimi."

## 2) Akilli Liste Deneyimi (55 sn)
- `Doktorlar` sayfasina git.
- Klinik filtresi + siralama (`Rating / Reviews / A-Z`) kullan.
- Ustteki panel aramasina bir anahtar kelime yaz (`implant`, `Istanbul` gibi) ve listenin anlik filtrelenmesini goster.
- Sonra `Klinikler` bolumunde lokasyon filtresi + siralamayi ayni sekilde dene.

## 3) Randevu Akisi (60 sn)
- Ana sayfada `Randevu Al` modalini ac.
- Tedavi, tarih, saat sec; kaydi tamamla.
- Mesaj: "Bu asamada backend yok, ama tum akisi local demo store uzerinden gercek zamanli simule ediyoruz."

## 4) Patient Panel Senaryosu (45 sn)
- `/tr/patient` ekranina git.
- Yeni randevunun dashboard kartlarina yansidigini goster.
- `Randevularim` sayfasinda durum rozetlerini goster (pending/approved/cancelled vb.).
- Arama kutusuna status veya tedavi adi yazip filtreyi canli goster.

## 5) Doctor Panel Senaryosu (60 sn)
- `/tr/doctor` ekranina git.
- Bugunku randevular listesinde `Onayla` ve `Iptal` butonlarina bas.
- Status metin ve renklerinin anlik degistigini goster.
- `Doctor > Randevular` ekraninda filtre + arama + durum guncelleme akisini tekrarla.

## 6) Admin Panel Kisa Tur (30 sn)
- `/tr/admin` ekranina git.
- Son aktiviteler listesinin arama kutusuna bagli olarak filtrelendigini goster.
- Mesaj: "Tum panellerde ayni arama davranisi ve tutarli UI dili var."

## Kapanis Cumlesi (onerilen)
- "Bu demo surumunde kullanici akislarini backend'siz ama canli sekilde calistirdik:
  randevu olusturma, onay/iptal, arama/filtre/siralama ve cok dilli deneyim tek yapida hazir.
  Bir sonraki adimda bu ayni UX katmani API ve veritabaniyla production'a tasinabilir."

## Sunum Oncesi 60 Saniye Kontrol Listesi
- Sunucu acik mi kontrol et: `http://localhost:3000`
- Locale testi: `TR -> EN -> DE` gecisleri hizli kontrol
- `Demo Sifirla` butonuna bir kez bas (temiz baslangic)
- Tarayici sekmeleri hazir: `/tr`, `/tr/patient`, `/tr/doctor`, `/tr/admin`
- Zoom oranini `%100` yap, gereksiz sekmeleri kapat

## Soru Gelirse 10 Kisa Cevap (Kapanisa Ekle)
1. **Backend var mi?**  
   Su an demo surumu, backend'siz calisiyor.
2. **Veriler nerede tutuluyor?**  
   Demo verileri localStorage'da tutuluyor.
3. **Onayla/Iptal gercekten calisiyor mu?**  
   Evet, doktor panelinde durum anlik guncelleniyor.
4. **Coklu dil tam calisiyor mu?**  
   Evet, TR/EN/DE/ES destekli; randevu akisi da cok dilli.
5. **Neden once frontend demo yaptiniz?**  
   Kullanici akislarini hizli dogrulamak icin en verimli adim buydu.
6. **Canliya cikmaya hazir mi?**  
   Demo'ya hazir; canli icin API, auth ve DB entegrasyonu gerekir.
7. **Doktor ekrani neden Turkce agirlikli?**  
   Operasyon ekibi Turk oldugu icin bilincli olarak boyle birakildi.
8. **Arama/filtre gercek mi yoksa gorsel mi?**  
   Gercek; listeler query ve secimlere gore anlik filtreleniyor.
9. **Demo nasil sifirlaniyor?**  
   Paneldeki `Demo Sifirla` ile tek tikta temiz baslangic yapiliyor.
10. **Bir sonraki adim ne?**  
    Ayni UX'i bozmadan API + veritabani + rol bazli auth baglamak.
