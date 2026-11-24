"""SQLite veritabanı işlemleri: profil, yemek ve spor kayıtları."""

import sqlite3
from pathlib import Path

# Veritabanı dosyası uygulamanın yanında tutulur.
VARSAYILAN_YOL = Path(__file__).with_name("kalori_takip.db")


class Veritabani:
    def __init__(self, yol=VARSAYILAN_YOL):
        self.baglanti = sqlite3.connect(str(yol))
        self.baglanti.row_factory = sqlite3.Row
        self._tablolari_olustur()

    def _tablolari_olustur(self):
        # Profil tek satırdır (id = 1). Yemek ve spor kayıtları tarihe göre tutulur.
        self.baglanti.executescript(
            """
            CREATE TABLE IF NOT EXISTS profil (
                id       INTEGER PRIMARY KEY CHECK (id = 1),
                boy      REAL    NOT NULL,
                kilo     REAL    NOT NULL,
                cinsiyet TEXT    NOT NULL CHECK (cinsiyet IN ('erkek', 'kadın')),
                yas      INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS yemekler (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                tarih   TEXT NOT NULL,          -- YYYY-AA-GG
                ad      TEXT NOT NULL,
                kalori  REAL NOT NULL,
                notlar  TEXT
            );
            CREATE TABLE IF NOT EXISTS sporlar (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                tarih   TEXT NOT NULL,
                ad      TEXT NOT NULL,
                kalori  REAL NOT NULL,
                notlar  TEXT
            );
            CREATE INDEX IF NOT EXISTS ix_yemek_tarih ON yemekler(tarih);
            CREATE INDEX IF NOT EXISTS ix_spor_tarih  ON sporlar(tarih);
            """
        )
        self.baglanti.commit()

    # ---------- Profil ----------
    def profil_getir(self):
        satir = self.baglanti.execute("SELECT * FROM profil WHERE id = 1").fetchone()
        return dict(satir) if satir else None

    def profil_kaydet(self, boy, kilo, cinsiyet, yas):
        # INSERT OR REPLACE: profil yoksa ekler, varsa günceller.
        self.baglanti.execute(
            "INSERT OR REPLACE INTO profil (id, boy, kilo, cinsiyet, yas) VALUES (1, ?, ?, ?, ?)",
            (boy, kilo, cinsiyet, yas),
        )
        self.baglanti.commit()

    # ---------- Yemek / Spor ----------
    def _ekle(self, tablo, tarih, ad, kalori, notlar):
        self.baglanti.execute(
            f"INSERT INTO {tablo} (tarih, ad, kalori, notlar) VALUES (?, ?, ?, ?)",
            (tarih, ad, kalori, notlar),
        )
        self.baglanti.commit()

    def _listele(self, tablo, tarih):
        satirlar = self.baglanti.execute(
            f"SELECT * FROM {tablo} WHERE tarih = ? ORDER BY id", (tarih,)
        ).fetchall()
        return [dict(s) for s in satirlar]

    def _sil(self, tablo, kayit_id):
        self.baglanti.execute(f"DELETE FROM {tablo} WHERE id = ?", (kayit_id,))
        self.baglanti.commit()

    def yemek_ekle(self, tarih, ad, kalori, notlar=""):
        self._ekle("yemekler", tarih, ad, kalori, notlar)

    def spor_ekle(self, tarih, ad, kalori, notlar=""):
        self._ekle("sporlar", tarih, ad, kalori, notlar)

    def yemekleri_getir(self, tarih):
        return self._listele("yemekler", tarih)

    def sporlari_getir(self, tarih):
        return self._listele("sporlar", tarih)

    def yemek_sil(self, kayit_id):
        self._sil("yemekler", kayit_id)

    def spor_sil(self, kayit_id):
        self._sil("sporlar", kayit_id)

    def kapat(self):
        self.baglanti.close()
