# Kalori ve Spor Takip

İki sürümü var: **telefon (web uygulaması, `docs/`)** ve **masaüstü (Python/Tkinter)**.

## 📱 Telefon sürümü (Android / iPhone)

`docs/` klasörü, telefona "uygulama gibi" kurulabilen bir web uygulamasıdır (PWA).
Veriler telefonda SQLite (sql.js) ile saklanır; internet olmadan da açılır, kalori hesabı için internet gerekir.

**Yayınlama (bir kez):**
- *GitHub Pages:* Depo → Settings → Pages → "Deploy from a branch" → dal: `ccr-0219eb3c-uja5t2`, klasör: `/docs` → Save.
  Birkaç dakika sonra adres `https://seco24.github.io/sercan-Spor-besin/` olur.
  Not: GitHub Pages özel (private) depolarda yalnızca ücretli planlarda çalışır; ücretsiz kullanmak için depo herkese açık olmalı.
- *Alternatif (depo özel kalsın):* `docs` klasörünü https://app.netlify.com/drop adresine sürükleyip bırakın; size bir adres verir.

**Telefona kurulum (Android / Chrome):** adresi Chrome'da açın → sağ üstteki ⋮ menü → **"Ana ekrana ekle"** / **"Uygulamayı yükle"**.
İlk açılışta boy, kilo, yaş, cinsiyet ve Anthropic API anahtarınızı girin.

**API anahtarı:** Telefonda ortam değişkeni olmadığı için anahtar ⚙ Ayarlar'a bir kez girilir; kodda yer almaz,
yalnızca o telefonun tarayıcı deposunda tutulur ve sadece `api.anthropic.com`'a gönderilir. Telefonu başkasıyla paylaşıyorsanız
anahtarı ayarlardan silebilirsiniz. Anthropic konsolunda anahtar için harcama limiti koymanız önerilir.

**Yedek:** ⚙ Ayarlar → "Yedeği indir (.db)" ile tüm kayıtları SQLite dosyası olarak alabilir, "Yedekten yükle" ile geri yükleyebilirsiniz.

**Geliştirme:** kaynak kod `mobil/src/` içinde.
```bash
cd mobil && npm install
npm test        # hesaplama ve JSON testleri
npm run build   # docs/ klasörünü yeniden üretir
```
Kodu değiştirdiyseniz `mobil/src/sw.js` içindeki `SURUM` değerini artırın ki telefonlar yeni sürümü alsın.

## 🖥 Masaüstü sürümü

Türkçe arayüzlü, sade bir masaüstü kalori ve spor takip uygulaması (Python + Tkinter + SQLite).
Yemek ve egzersiz kalorileri, serbest metinden Anthropic Claude API ile tahmin edilir.

## Özellikler
- **İlk açılış:** boy, kilo, cinsiyet ve yaş istenir; SQLite'a kaydedilir ("Profili düzenle" ile güncellenebilir).
- **BMR (Mifflin-St Jeor):** erkek `10×kilo + 6.25×boy − 5×yaş + 5`, kadın aynı formülde `−161`.
- **Yemekler:** "200 gram pilav", "margarita pizza, 2 dilim" gibi metinler yazılır; kalori API'den alınır.
- **Spor:** "30 dakika koşu" gibi metinler yazılır; kullanıcının kilosu da gönderilerek yakılan kalori tahmin edilir.
- **Günün özeti:** Alınan, BMR, sporla yakılan ve **Net = Alınan − BMR − Yakılan**.
- **Tarih gezinme:** ◀ / ▶ düğmeleri, "Bugün" veya YYYY-AA-GG yazıp Enter.
- Tüm veriler `kalori_takip.db` dosyasında tutulur ve uygulama açılınca yüklenir.

## Kurulum
Python 3.10+ ve Tkinter gerekir (Windows/macOS'ta Python ile gelir; Ubuntu'da `sudo apt install python3-tk`).

```bash
pip install -r requirements.txt
```

## API anahtarı (ortam değişkeni)
Anahtar koda yazılmaz, `ANTHROPIC_API_KEY` ortam değişkeninden okunur:

```bash
# Linux / macOS
export ANTHROPIC_API_KEY="sk-ant-..."
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."
```

## Çalıştırma
```bash
python uygulama.py
```

## Testler (API ve arayüz gerektirmez)
```bash
python -m unittest discover -s tests
```

## Dosyalar
| Dosya | Görev |
|---|---|
| `uygulama.py` | Tkinter arayüzü (profil penceresi, özet, yemek/spor sekmeleri) |
| `veritabani.py` | SQLite tabloları ve sorgular |
| `hesaplama.py` | BMR ve günlük özet hesapları |
| `yapay_zeka.py` | Claude API çağrıları ve JSON yanıt ayrıştırma |

> Not: Kalori değerleri yapay zeka tahminidir; modelin notu her kaydın yanında gösterilir.
