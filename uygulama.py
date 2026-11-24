"""Kalori ve Spor Takip - Tkinter masaüstü arayüzü.

Çalıştırma:  python uygulama.py
Gerekli:     ANTHROPIC_API_KEY ortam değişkeni
"""

import threading
import tkinter as tk
from datetime import date, datetime, timedelta
from tkinter import messagebox, ttk

import yapay_zeka
from hesaplama import bmr_hesapla, gunluk_ozet
from veritabani import Veritabani

TARIH_BICIMI = "%Y-%m-%d"


class ProfilPenceresi(tk.Toplevel):
    """İlk açılışta (veya 'Profili düzenle' ile) boy, kilo, cinsiyet ve yaş ister."""

    def __init__(self, ana, db, profil=None, kaydedilince=None):
        super().__init__(ana)
        self.db = db
        self.kaydedilince = kaydedilince
        self.title("Profil Bilgileri")
        self.resizable(False, False)
        self.transient(ana)

        cerceve = ttk.Frame(self, padding=16)
        cerceve.pack(fill="both", expand=True)

        ttk.Label(cerceve, text="Lütfen bilgilerinizi girin", font=("", 12, "bold")).grid(
            row=0, column=0, columnspan=2, pady=(0, 10)
        )

        self.boy = tk.StringVar(value=str(profil["boy"]) if profil else "")
        self.kilo = tk.StringVar(value=str(profil["kilo"]) if profil else "")
        self.yas = tk.StringVar(value=str(profil["yas"]) if profil else "")
        self.cinsiyet = tk.StringVar(value=profil["cinsiyet"] if profil else "erkek")

        for satir, (etiket, degisken) in enumerate(
            [("Boy (cm):", self.boy), ("Kilo (kg):", self.kilo), ("Yaş:", self.yas)], start=1
        ):
            ttk.Label(cerceve, text=etiket).grid(row=satir, column=0, sticky="w", pady=4)
            ttk.Entry(cerceve, textvariable=degisken, width=12).grid(row=satir, column=1, pady=4)

        ttk.Label(cerceve, text="Cinsiyet:").grid(row=4, column=0, sticky="w", pady=4)
        secim = ttk.Frame(cerceve)
        secim.grid(row=4, column=1, sticky="w")
        ttk.Radiobutton(secim, text="Erkek", value="erkek", variable=self.cinsiyet).pack(side="left")
        ttk.Radiobutton(secim, text="Kadın", value="kadın", variable=self.cinsiyet).pack(side="left")

        ttk.Button(cerceve, text="Kaydet", command=self.kaydet).grid(
            row=5, column=0, columnspan=2, pady=(12, 0)
        )

        # Profil yoksa pencere kapatılamaz; uygulama profil olmadan çalışamaz.
        if profil is None:
            self.protocol("WM_DELETE_WINDOW", ana.destroy)
        self.grab_set()

    def kaydet(self):
        # Girdileri doğrula: sayısal ve makul aralıkta olmalı.
        try:
            boy = float(self.boy.get().replace(",", "."))
            kilo = float(self.kilo.get().replace(",", "."))
            yas = int(self.yas.get())
            if not (50 <= boy <= 250 and 20 <= kilo <= 400 and 10 <= yas <= 120):
                raise ValueError
        except ValueError:
            messagebox.showerror(
                "Hatalı giriş",
                "Lütfen geçerli değerler girin.\nBoy: 50-250 cm, Kilo: 20-400 kg, Yaş: 10-120",
                parent=self,
            )
            return
        self.db.profil_kaydet(boy, kilo, self.cinsiyet.get(), yas)
        self.destroy()
        if self.kaydedilince:
            self.kaydedilince()


class KayitSekmesi(ttk.Frame):
    """Yemek ve spor sekmeleri için ortak yapı: metin girişi + o günün kayıt listesi."""

    def __init__(self, ana, uygulama, tur):
        super().__init__(ana, padding=12)
        self.uygulama = uygulama
        self.tur = tur  # "yemek" veya "spor"

        if tur == "yemek":
            aciklama = "Ne yediniz? (örn. '200 gram pilav' veya 'margarita pizza, 2 dilim')"
        else:
            aciklama = "Hangi egzersizi ne kadar yaptınız? (örn. '30 dakika koşu')"

        ttk.Label(self, text=aciklama).pack(anchor="w")
        giris_satiri = ttk.Frame(self)
        giris_satiri.pack(fill="x", pady=6)
        self.metin = tk.StringVar()
        giris = ttk.Entry(giris_satiri, textvariable=self.metin)
        giris.pack(side="left", fill="x", expand=True)
        giris.bind("<Return>", lambda _e: self.ekle())
        self.buton = ttk.Button(giris_satiri, text="Hesapla ve Ekle", command=self.ekle)
        self.buton.pack(side="left", padx=(6, 0))

        self.durum = ttk.Label(self, text="", foreground="gray")
        self.durum.pack(anchor="w")

        # Kayıt tablosu
        self.tablo = ttk.Treeview(self, columns=("ad", "kalori", "not"), show="headings", height=8)
        self.tablo.heading("ad", text="Yemek" if tur == "yemek" else "Egzersiz")
        self.tablo.heading("kalori", text="kcal")
        self.tablo.heading("not", text="Not")
        self.tablo.column("ad", width=200)
        self.tablo.column("kalori", width=70, anchor="e")
        self.tablo.column("not", width=320)
        self.tablo.pack(fill="both", expand=True, pady=(6, 0))

        ttk.Button(self, text="Seçili kaydı sil", command=self.sil).pack(anchor="e", pady=(6, 0))

    def ekle(self):
        metin = self.metin.get().strip()
        if not metin:
            return
        tarih = self.uygulama.secili_tarih_metni()
        self.buton.state(["disabled"])
        self.durum.config(text="Yapay zekaya soruluyor...")
        # Kilo ana iş parçacığında okunur (SQLite bağlantısı yalnızca burada kullanılabilir).
        kilo = self.uygulama.db.profil_getir()["kilo"]

        # API çağrısı arayüzü dondurmasın diye ayrı bir iş parçacığında yapılır.
        # Bu iş parçacığı veritabanına dokunmaz; sonucu after() ile ana döngüye iletir.
        def is_parcacigi():
            try:
                if self.tur == "yemek":
                    sonuc = yapay_zeka.yemek_kalorisi(metin)
                else:
                    sonuc = yapay_zeka.spor_kalorisi(metin, kilo)
                self.after(0, lambda: self._basarili(tarih, metin, sonuc))
            except yapay_zeka.YapayZekaHatasi as hata:
                mesaj = str(hata)
                self.after(0, lambda: self._hatali(mesaj))

        threading.Thread(target=is_parcacigi, daemon=True).start()

    def _basarili(self, tarih, metin, sonuc):
        db = self.uygulama.db
        if self.tur == "yemek":
            db.yemek_ekle(tarih, metin, sonuc["kalori"], sonuc["not"])
        else:
            db.spor_ekle(tarih, metin, sonuc["kalori"], sonuc["not"])
        self.metin.set("")
        self.durum.config(text=f"Eklendi: {metin} → {sonuc['kalori']:.0f} kcal")
        self.buton.state(["!disabled"])
        self.uygulama.yenile()

    def _hatali(self, mesaj):
        self.durum.config(text="")
        self.buton.state(["!disabled"])
        messagebox.showerror("Hata", mesaj)

    def sil(self):
        secili = self.tablo.selection()
        if not secili:
            return
        if not messagebox.askyesno("Sil", "Seçili kayıt silinsin mi?"):
            return
        for kayit_id in secili:
            if self.tur == "yemek":
                self.uygulama.db.yemek_sil(int(kayit_id))
            else:
                self.uygulama.db.spor_sil(int(kayit_id))
        self.uygulama.yenile()

    def doldur(self, kayitlar):
        self.tablo.delete(*self.tablo.get_children())
        for k in kayitlar:
            # Satır kimliği olarak veritabanı id'si kullanılır (silme için).
            self.tablo.insert("", "end", iid=str(k["id"]),
                              values=(k["ad"], f"{k['kalori']:.0f}", k["notlar"] or ""))


class Uygulama(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Kalori ve Spor Takip")
        self.geometry("760x620")
        self.minsize(600, 480)

        self.db = Veritabani()
        self.secili_tarih = date.today()

        self._ust_cubuk()
        self._ozet_paneli()

        sekmeler = ttk.Notebook(self)
        sekmeler.pack(fill="both", expand=True, padx=10, pady=(0, 10))
        self.yemek_sekmesi = KayitSekmesi(sekmeler, self, "yemek")
        self.spor_sekmesi = KayitSekmesi(sekmeler, self, "spor")
        sekmeler.add(self.yemek_sekmesi, text="🍽  Yemekler")
        sekmeler.add(self.spor_sekmesi, text="🏃  Spor")

        # İlk açılış: profil yoksa bilgileri iste, varsa geçmiş kayıtları yükle.
        if self.db.profil_getir() is None:
            self.after(100, lambda: ProfilPenceresi(self, self.db, kaydedilince=self.yenile))
        else:
            self.yenile()

        self.protocol("WM_DELETE_WINDOW", self.kapat)

    # ---------- Arayüz parçaları ----------
    def _ust_cubuk(self):
        cubuk = ttk.Frame(self, padding=(10, 10, 10, 4))
        cubuk.pack(fill="x")
        ttk.Button(cubuk, text="◀", width=3, command=lambda: self.gun_degistir(-1)).pack(side="left")
        self.tarih_degiskeni = tk.StringVar()
        tarih_girisi = ttk.Entry(cubuk, textvariable=self.tarih_degiskeni, width=12, justify="center")
        tarih_girisi.pack(side="left", padx=4)
        tarih_girisi.bind("<Return>", lambda _e: self.tarihe_git())
        ttk.Button(cubuk, text="▶", width=3, command=lambda: self.gun_degistir(1)).pack(side="left")
        ttk.Button(cubuk, text="Bugün", command=self.bugune_don).pack(side="left", padx=6)
        ttk.Label(cubuk, text="(YYYY-AA-GG yazıp Enter'a basabilirsiniz)", foreground="gray").pack(side="left")
        ttk.Button(cubuk, text="Profili düzenle", command=self.profil_duzenle).pack(side="right")

    def _ozet_paneli(self):
        panel = ttk.LabelFrame(self, text="Günün Özeti", padding=10)
        panel.pack(fill="x", padx=10, pady=6)
        self.ozet_etiketleri = {}
        basliklar = [
            ("alinan", "Alınan"),
            ("bmr", "BMR"),
            ("yakilan", "Sporla Yakılan"),
            ("net", "Net"),
        ]
        for sutun, (anahtar, baslik) in enumerate(basliklar):
            panel.columnconfigure(sutun, weight=1)
            ttk.Label(panel, text=baslik, foreground="gray").grid(row=0, column=sutun)
            etiket = ttk.Label(panel, text="-", font=("", 16, "bold"))
            etiket.grid(row=1, column=sutun)
            self.ozet_etiketleri[anahtar] = etiket
        ttk.Label(
            panel,
            text="Net = Alınan − BMR − Sporla Yakılan  (negatif değer kalori açığıdır)",
            foreground="gray",
        ).grid(row=2, column=0, columnspan=4, pady=(6, 0))

    # ---------- Tarih gezinme ----------
    def secili_tarih_metni(self):
        return self.secili_tarih.strftime(TARIH_BICIMI)

    def gun_degistir(self, fark):
        self.secili_tarih += timedelta(days=fark)
        self.yenile()

    def bugune_don(self):
        self.secili_tarih = date.today()
        self.yenile()

    def tarihe_git(self):
        try:
            self.secili_tarih = datetime.strptime(self.tarih_degiskeni.get().strip(), TARIH_BICIMI).date()
        except ValueError:
            messagebox.showerror("Hatalı tarih", "Tarihi YYYY-AA-GG biçiminde girin (örn. 2026-11-24).")
        self.yenile()

    def profil_duzenle(self):
        ProfilPenceresi(self, self.db, profil=self.db.profil_getir(), kaydedilince=self.yenile)

    # ---------- Verileri yenile ----------
    def yenile(self):
        """Seçili günün kayıtlarını veritabanından yükler ve özeti günceller."""
        profil = self.db.profil_getir()
        if profil is None:
            return
        tarih = self.secili_tarih_metni()
        self.tarih_degiskeni.set(tarih)

        yemekler = self.db.yemekleri_getir(tarih)
        sporlar = self.db.sporlari_getir(tarih)
        self.yemek_sekmesi.doldur(yemekler)
        self.spor_sekmesi.doldur(sporlar)

        bmr = bmr_hesapla(profil["kilo"], profil["boy"], profil["yas"], profil["cinsiyet"])
        ozet = gunluk_ozet(yemekler, sporlar, bmr)
        for anahtar, deger in ozet.items():
            self.ozet_etiketleri[anahtar].config(text=f"{deger:,.0f} kcal".replace(",", "."))
        # Net değeri renklendir: fazla kırmızı, açık yeşil.
        self.ozet_etiketleri["net"].config(foreground="#c0392b" if ozet["net"] > 0 else "#27ae60")

    def kapat(self):
        self.db.kapat()
        self.destroy()


if __name__ == "__main__":
    Uygulama().mainloop()
