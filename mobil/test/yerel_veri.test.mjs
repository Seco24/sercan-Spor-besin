// Hazır veri ayrıştırıcısının testleri:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { yemekHesapla, sporHesapla } from "../src/yerel_veri.js";
import { SPORLAR } from "../src/veri/sporlar.js";
import { BESINLER } from "../src/veri/besinler.js";

const kcal = (m) => yemekHesapla(m)?.kalori ?? null;

test("tanınan yemekler", () => {
  assert.equal(kcal("2 yumurta"), 155);                 // 2 × 50 g × 155/100
  assert.equal(kcal("2 Haşlanmış Yumurta"), 155);
  assert.equal(kcal("yumurta 2"), 155);
  assert.equal(kcal("iki yumurta"), 155);
  assert.equal(kcal("yumurta"), 78);                    // birim/sayı yoksa 1 adet
  assert.equal(kcal("200 gram haşlanmış pirinç"), 260);
  assert.equal(kcal("200gr haşlanmış pirinç"), 260);
  assert.equal(kcal("200 gramlık haşlanmış pirinç"), 260);
  assert.equal(kcal("2 dilim ekmek"), 154);             // 2 × 29 g × 266/100
  assert.equal(kcal("ekmek 2 dilim"), 154);
  assert.equal(kcal("1 su bardağı süt"), 122);
  assert.equal(kcal("yarım su bardağı süt"), 61);
  assert.equal(kcal("1 buçuk dilim ekmek"), 116);
  assert.equal(kcal("1,5 dilim ekmek"), 116);
  assert.equal(kcal("3 elmalar"), Math.round(3 * 182 * 0.52));
  assert.equal(kcal("2 dilim ekmek ve 1 dilim beyaz peynir"), Math.round(2 * 29 * 2.66 + 30 * 2.65));
  assert.equal(kcal("2 yumurta, 1 domates, 1 çay bardağı çay"), Math.round(100 * 1.55 + 123 * 0.18 + 1));
  assert.match(yemekHesapla("2 yumurta").not, /USDA/);
});

test("tanınmayanlar yapay zekaya bırakılır", () => {
  for (const m of [
    "200 gram pilav",               // pilav tabloda yok (yağlı), sadece haşlanmış pirinç var
    "margarita pizza, 2 dilim",
    "2 dilim ekmek ve 1 dilim karpuzlu kek",
    "tavuk göğsü",                  // adet tanımsız: tahmin yapma
    "1 kase tavuk göğsü",           // birim tanımsız
    "yumurtalı ekmek",
    "2 büyük yumurta",              // "büyük" anlaşılmadı
    "", "   ",
  ]) assert.equal(yemekHesapla(m), null, m);
});

test("spor", () => {
  assert.equal(sporHesapla("30 dakika koşu", 75).kalori, Math.round(9.3 * 75 * 0.5));
  assert.equal(sporHesapla("koşu 30 dk", 75).kalori, Math.round(9.3 * 75 * 0.5));
  assert.equal(sporHesapla("1 saat yüzme", 80).kalori, 480);
  assert.equal(sporHesapla("yarım saat hızlı yürüyüş", 70).kalori, Math.round(4.8 * 70 * 0.5));
  assert.equal(sporHesapla("1 saat 30 dakika bisiklet", 70).kalori, Math.round(7 * 70 * 1.5));
  assert.equal(sporHesapla("1 buçuk saat bisiklet", 70).kalori, Math.round(7 * 70 * 1.5));
  assert.equal(sporHesapla("45 dakikalık yoga", 60).kalori, Math.round(2.3 * 60 * 0.75));
  assert.equal(sporHesapla("20 dk ip atlama yaptım", 70).kalori, Math.round(11.8 * 70 / 3));
  assert.match(sporHesapla("30 dakika koşu", 75).not, /Compendium 12050/);
  for (const m of ["30 dakika koşu ve 10 dakika yürüyüş", "10 km koşu", "koşu", "30 dakika squash", "1000 dakika koşu"]) {
    assert.equal(sporHesapla(m, 75), null, m);
  }
});

test("tablolarda aynı ad iki kez yok", () => {
  for (const [ad, liste] of [["besin", BESINLER], ["spor", SPORLAR]]) {
    const adlar = liste.flatMap((x) => x.adlar.map((a) => a.toLocaleLowerCase("tr")));
    assert.equal(new Set(adlar).size, adlar.length, ad);
  }
});
