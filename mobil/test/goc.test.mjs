// Eski sürüm veritabanının (sporlar tablosunda kilo sütunu yok) yeni sürümde açılabildiğini test eder.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { Veritabani } from "../src/veritabani.js";

test("eski veritabanı yükseltilir ve önceki kayıtlar okunur", async () => {
  const SQL = await initSqlJs();
  const eski = new SQL.Database();
  eski.exec(`CREATE TABLE sporlar (id INTEGER PRIMARY KEY AUTOINCREMENT, tarih TEXT NOT NULL,
               ad TEXT NOT NULL, kalori REAL NOT NULL, notlar TEXT);
             INSERT INTO sporlar (tarih, ad, kalori, notlar) VALUES ('2026-11-24', '30 dk koşu', 350, 'x');`);
  const db = new Veritabani(new SQL.Database(eski.export()));
  db._semaHazirla();
  db._semaHazirla(); // iki kez çalışması sorun olmamalı
  db._kaydet = async () => {}; // Node'da IndexedDB yok; kalıcı kaydı atla.
  await db.kayitEkle("sporlar", "2026-11-25", "30 dk koşu", 360, "y", 80);
  await db.kayitEkle("yemekler", "2026-11-25", "Pilav", 260, "z");
  await db.kayitEkle("yemekler", "2026-11-25", "çay", 2, "");
  const spor = db.oncekiKayitlar("sporlar");
  assert.equal(spor.length, 1);
  assert.equal(spor[0].kalori, 360);
  assert.equal(spor[0].kilo, 80);
  assert.deepEqual(db.oncekiKayitlar("yemekler").map((k) => k.ad), ["çay", "Pilav"]);
});
