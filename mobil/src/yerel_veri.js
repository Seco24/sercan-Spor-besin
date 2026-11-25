// Hazır veriyle (internetsiz, ücretsiz) kalori hesabı.
//
// Yazılan metin hazır tablolardaki bir besin/egzersizle TAM olarak eşleşirse sonuç
// buradan hesaplanır; eşleşmezse null döner ve uygulama yapay zekaya sorar.
// Yanlış eşleşme yapmamak için bilinçli olarak katıdır: anlaşılmayan tek bir kelime
// bile varsa yapay zekaya bırakılır.
//
//   Yemek:  "2 yumurta", "200 gram haşlanmış pirinç", "2 dilim ekmek ve 1 dilim beyaz peynir"
//   Spor:   "30 dakika koşu", "yüzme 1 saat", "yarım saat hızlı yürüyüş"

import { BESINLER } from "./veri/besinler.js";
import { SPORLAR } from "./veri/sporlar.js";

// ---------- Metin hazırlama ----------
export function normallestir(metin) {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/(\d),(\d)/g, "$1.$2")          // 1,5 -> 1.5
    .replace(/(\d)([a-zçğıöşü])/g, "$1 $2")  // 200gr -> 200 gr
    .replace(/[^\p{L}\d.\s]/gu, " ")         // noktalama işaretlerini at
    .replace(/\.(?!\d)/g, " ")               // cümle sonu noktası
    .replace(/\s+/g, " ")
    .trim();
}

const SAYI_KELIMELERI = {
  yarım: 0.5, bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10,
};
const SAYI = `(?:\\d+(?:\\.\\d+)?|${Object.keys(SAYI_KELIMELERI).join("|")})(?: buçuk)?`;

function sayiOku(metin) {
  const [ana, bucuk] = metin.split(" ");
  const deger = SAYI_KELIMELERI[ana] ?? Number(ana);
  return bucuk === "buçuk" ? deger + 0.5 : deger;
}

// Yazılış biçimleri -> tablodaki birim adı
const BIRIM_ESANLAMLI = {
  gram: "gram", gr: "gram", g: "gram", kg: "kg", kilo: "kg", ml: "ml",
  adet: "adet", tane: "adet",
  dilim: "dilim", "su bardağı": "su bardağı", bardak: "bardak", "çay bardağı": "çay bardağı",
  kase: "kase", kâse: "kase", "yemek kaşığı": "yemek kaşığı", "tatlı kaşığı": "tatlı kaşığı",
  "çay kaşığı": "çay kaşığı", avuç: "avuç", yaprak: "yaprak", küp: "küp", kupa: "kupa",
  fincan: "fincan", "kibrit kutusu": "kibrit kutusu",
};
// Uzun ifadeler önce denensin ("çay bardağı" "bardak"tan önce)
const BIRIM = `(?:${Object.keys(BIRIM_ESANLAMLI).sort((a, b) => b.length - a.length).join("|")})`;
const BIRIM_EKI = "(?:l[ıiuü]k)?"; // "200 gramlık", "1 dilimlik"

// Besin adı -> besin kaydı
const BESIN_ADLARI = new Map();
for (const b of BESINLER) for (const ad of b.adlar) BESIN_ADLARI.set(normallestir(ad), b);
const SPOR_ADLARI = new Map();
for (const s of SPORLAR) for (const ad of s.adlar) SPOR_ADLARI.set(normallestir(ad), s);

// "yumurtalar", "elmalar" gibi çoğul yazımları da tanı.
function adBul(harita, ad) {
  return harita.get(ad) ?? harita.get(ad.replace(/l[ae]r$/, "")) ?? null;
}

const yuvarla = (n) => Math.round(n * 10) / 10;

// ---------- Yemek ----------
const ON_KALIP = new RegExp(`^(?:(${SAYI}) ?)?(?:(${BIRIM})${BIRIM_EKI} )?(.+)$`); // "2 dilim ekmek"
const SON_KALIP = new RegExp(`^(.+?) (${SAYI})(?: (${BIRIM}))?$`);              // "ekmek 2 dilim"

function tekBesin(parca) {
  let sayi, birimYazisi, ad;
  let m = parca.match(SON_KALIP);
  if (m && adBul(BESIN_ADLARI, m[1])) [, ad, sayi, birimYazisi] = m;
  else if ((m = parca.match(ON_KALIP))) [, sayi, birimYazisi, ad] = m;
  else return null;

  const besin = adBul(BESIN_ADLARI, ad);
  if (!besin) return null;
  const miktar = sayi ? sayiOku(sayi) : 1;
  if (!(miktar > 0 && miktar <= 5000)) return null;

  // Birim yazılmadıysa: "2 yumurta" -> adet. Adedi tanımsız besinde ("tavuk göğsü") tahmin yapma.
  const birim = birimYazisi ? BIRIM_ESANLAMLI[birimYazisi] : "adet";
  const birimGram = besin.birimler[birim];
  if (!birimGram) return null;

  const gram = miktar * birimGram;
  const kalori = (gram * besin.kcal100) / 100;
  const birimMetni = birim === "gram" ? "g" : birim;
  return {
    kalori,
    not: `${miktar} ${birimMetni} ${besin.adlar[0]} ≈ ${Math.round(gram)} g × ${besin.kcal100} kcal/100 g`,
  };
}

// Döndürür: { kalori, not } ya da null (yapay zekaya sorulmalı)
export function yemekHesapla(metin) {
  // Önce virgül/artı ile böl (1,5 gibi ondalık virgüle dokunmadan), sonra "ve"/"ile" ile.
  const parcalar = metin
    .split(/(?<!\d),|,(?!\d)|[+;&]/)
    .flatMap((p) => normallestir(p).split(/ (?:ve|ile) /))
    .map((p) => p.trim())
    .filter(Boolean);
  if (parcalar.length === 0) return null;
  const sonuclar = [];
  for (const p of parcalar) {
    const s = tekBesin(p);
    if (!s) return null; // tek bir parça bile tanınmazsa hepsini yapay zekaya bırak
    sonuclar.push(s);
  }
  return {
    kalori: Math.round(sonuclar.reduce((t, s) => t + s.kalori, 0)),
    not: "Hazır veri (USDA): " + sonuclar.map((s) => s.not).join("; "),
  };
}

// ---------- Spor ----------
const SURE = new RegExp(
  `(?:(${SAYI}) (?:saat|sa)(?: (${SAYI}) (?:dakika|dak|dk))?|(${SAYI}) (?:dakika|dak|dk))${BIRIM_EKI}`
);

// Döndürür: { kalori, not } ya da null
export function sporHesapla(metin, kilo) {
  const temiz = normallestir(metin);
  const m = temiz.match(SURE);
  if (!m) return null;
  const dakika = m[3] ? sayiOku(m[3]) : sayiOku(m[1]) * 60 + (m[2] ? sayiOku(m[2]) : 0);
  if (!(dakika > 0 && dakika <= 600)) return null;

  const ad = (temiz.slice(0, m.index) + " " + temiz.slice(m.index + m[0].length))
    .replace(/\b(yaptım|yaptim|ettim)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const spor = adBul(SPOR_ADLARI, ad);
  if (!spor) return null;

  const kalori = spor.met * kilo * (dakika / 60);
  return {
    kalori: Math.round(kalori),
    not: `Hazır veri (Compendium ${spor.kod}): ${spor.aciklama}, MET ${spor.met} × ${kilo} kg × ${yuvarla(dakika / 60)} sa`,
  };
}
