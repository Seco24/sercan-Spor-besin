// SQLite veritabanı (sql.js = tarayıcıda çalışan SQLite).
// Veritabanı dosyası her değişiklikten sonra telefonun IndexedDB deposuna kaydedilir,
// uygulama açılınca oradan geri yüklenir; böylece geçmiş kayıtlar kaybolmaz.

const IDB_ADI = "kalori-takip";
const IDB_DEPO = "dosyalar";
const DB_ANAHTARI = "kalori_takip.db";

// --- IndexedDB yardımcıları (ham veritabanı baytlarını saklamak için) ---
function idbAc() {
  return new Promise((coz, reddet) => {
    const istek = indexedDB.open(IDB_ADI, 1);
    istek.onupgradeneeded = () => istek.result.createObjectStore(IDB_DEPO);
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => reddet(istek.error);
  });
}

async function idbOku(anahtar) {
  const idb = await idbAc();
  return new Promise((coz, reddet) => {
    const istek = idb.transaction(IDB_DEPO).objectStore(IDB_DEPO).get(anahtar);
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => reddet(istek.error);
  });
}

async function idbYaz(anahtar, deger) {
  const idb = await idbAc();
  return new Promise((coz, reddet) => {
    const islem = idb.transaction(IDB_DEPO, "readwrite");
    islem.objectStore(IDB_DEPO).put(deger, anahtar);
    islem.oncomplete = () => coz();
    islem.onerror = () => reddet(islem.error);
  });
}

const SEMA = `
  CREATE TABLE IF NOT EXISTS profil (
    id       INTEGER PRIMARY KEY CHECK (id = 1),
    boy      REAL    NOT NULL,
    kilo     REAL    NOT NULL,
    cinsiyet TEXT    NOT NULL CHECK (cinsiyet IN ('erkek', 'kadın')),
    yas      INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS yemekler (
    id INTEGER PRIMARY KEY AUTOINCREMENT, tarih TEXT NOT NULL,
    ad TEXT NOT NULL, kalori REAL NOT NULL, notlar TEXT
  );
  CREATE TABLE IF NOT EXISTS sporlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT, tarih TEXT NOT NULL,
    ad TEXT NOT NULL, kalori REAL NOT NULL, notlar TEXT,
    kilo REAL  -- hesaplama anındaki kilo (kayıtlı sonucu yeni kiloya ölçeklemek için)
  );
  CREATE INDEX IF NOT EXISTS ix_yemek_tarih ON yemekler(tarih);
  CREATE INDEX IF NOT EXISTS ix_spor_tarih  ON sporlar(tarih);
`;

export class Veritabani {
  // Kullanım: const db = await Veritabani.ac();
  static async ac() {
    // initSqlJs, index.html'de yüklenen sql-wasm.js dosyasından gelir.
    const SQL = await window.initSqlJs({ locateFile: (dosya) => `./${dosya}` });
    const kayitli = await idbOku(DB_ANAHTARI);
    const db = new Veritabani(kayitli ? new SQL.Database(kayitli) : new SQL.Database());
    db._semaHazirla();
    // Tarayıcıdan, depolamayı yer açmak için silmemesini iste (desteklenirse).
    navigator.storage?.persist?.();
    return db;
  }

  constructor(sqlDb) {
    this.db = sqlDb;
  }

  // Tabloları oluştur; eski sürümden gelen veritabanına eksik sütunu ekle.
  _semaHazirla() {
    this.db.exec(SEMA);
    const sutunlar = this._sorgu("PRAGMA table_info(sporlar)").map((s) => s.name);
    if (!sutunlar.includes("kilo")) this.db.exec("ALTER TABLE sporlar ADD COLUMN kilo REAL");
  }

  // Her yazma işleminden sonra veritabanını kalıcı depoya kaydet.
  async _kaydet() {
    await idbYaz(DB_ANAHTARI, this.db.export());
  }

  _sorgu(sql, parametreler = []) {
    const ifade = this.db.prepare(sql);
    ifade.bind(parametreler);
    const satirlar = [];
    while (ifade.step()) satirlar.push(ifade.getAsObject());
    ifade.free();
    return satirlar;
  }

  // ---------- Profil ----------
  profilGetir() {
    return this._sorgu("SELECT * FROM profil WHERE id = 1")[0] ?? null;
  }

  async profilKaydet(boy, kilo, cinsiyet, yas) {
    this.db.run(
      "INSERT OR REPLACE INTO profil (id, boy, kilo, cinsiyet, yas) VALUES (1, ?, ?, ?, ?)",
      [boy, kilo, cinsiyet, yas]
    );
    await this._kaydet();
  }

  // ---------- Yemek / Spor ----------
  // tablo yalnızca "yemekler" veya "sporlar" olabilir (kullanıcı girdisi değildir).
  async kayitEkle(tablo, tarih, ad, kalori, notlar = "", kilo = null) {
    if (tablo === "sporlar") {
      this.db.run("INSERT INTO sporlar (tarih, ad, kalori, notlar, kilo) VALUES (?, ?, ?, ?, ?)",
        [tarih, ad, kalori, notlar, kilo]);
    } else {
      this.db.run("INSERT INTO yemekler (tarih, ad, kalori, notlar) VALUES (?, ?, ?, ?)",
        [tarih, ad, kalori, notlar]);
    }
    await this._kaydet();
  }

  // Daha önce girilmiş farklı kayıtlar, en son girilen önce.
  // Hem "kayıtlı sonucu tekrar kullan" hem de hızlı ekleme düğmeleri için kullanılır.
  oncekiKayitlar(tablo, sinir = 300) {
    const kiloSutunu = tablo === "sporlar" ? "kilo" : "NULL AS kilo";
    return this._sorgu(
      `SELECT ad, kalori, notlar, ${kiloSutunu} FROM ${tablo}
        WHERE id IN (SELECT MAX(id) FROM ${tablo} GROUP BY ad)
        ORDER BY id DESC LIMIT ?`,
      [sinir]
    );
  }

  kayitlariGetir(tablo, tarih) {
    return this._sorgu(`SELECT * FROM ${tablo} WHERE tarih = ? ORDER BY id`, [tarih]);
  }

  async kayitSil(tablo, id) {
    this.db.run(`DELETE FROM ${tablo} WHERE id = ?`, [id]);
    await this._kaydet();
  }

  // Yedekleme: veritabanının tamamını .db dosyası olarak dışa aktar / geri yükle.
  disaAktar() {
    return this.db.export();
  }

  async iceAktar(baytlar) {
    const SQL = await window.initSqlJs({ locateFile: (dosya) => `./${dosya}` });
    const yeni = new SQL.Database(baytlar);
    const eski = this.db;
    this.db = yeni;
    try {
      this._semaHazirla(); // Geçerli bir SQLite dosyası değilse burada hata verir.
    } catch (hata) {
      this.db = eski;
      yeni.close();
      throw hata;
    }
    eski.close();
    await this._kaydet();
  }
}
