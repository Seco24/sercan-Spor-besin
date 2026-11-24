// Arayüz ve API gerektirmeyen testler:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { bmrHesapla, gunlukOzet } from "../src/hesaplama.js";
import { jsonAyikla, YapayZekaHatasi } from "../src/yapay_zeka.js";

test("BMR erkek", () => assert.equal(bmrHesapla(80, 180, 30, "erkek"), 1780));
test("BMR kadın", () => assert.equal(bmrHesapla(60, 165, 25, "kadın"), 1345.25));
test("Net", () => {
  const o = gunlukOzet([{ kalori: 1500 }, { kalori: 700 }], [{ kalori: 300 }], 1780);
  assert.deepEqual(o, { alinan: 2200, bmr: 1780, yakilan: 300, net: 120 });
});
test("JSON düz", () => assert.equal(jsonAyikla('{"kalori": 260, "not": "x"}').kalori, 260));
test("JSON kod bloğu", () => assert.equal(jsonAyikla('```json\n{"kalori": "540.4", "not": "t"}\n```').kalori, 540));
test("JSON hatalı", () => assert.throws(() => jsonAyikla("bilmiyorum"), YapayZekaHatasi));
test("JSON kalori yok", () => assert.throws(() => jsonAyikla('{"not": "x"}'), YapayZekaHatasi));
