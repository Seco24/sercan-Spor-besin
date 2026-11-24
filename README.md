# Kalori ve Spor Takip

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
