// Arayüz mantığı: tarih gezinme, günün özeti, yemek/spor ekleme, ayarlar.

import { bmrHesapla, gunlukOzet } from "./hesaplama.js";
import { Veritabani } from "./veritabani.js";
import {
  YapayZekaHatasi, anahtarGetir, anahtarKaydet, sporKalorisi, yemekKalorisi,
} from "./yapay_zeka.js";

const $ = (secici) => document.querySelector(secici);
const sayi = (n) => Math.round(n).toLocaleString("tr-TR");

let db;
let seciliTarih = bugun();
let aktifSekme = "yemekler"; // "yemekler" | "sporlar"

// Yerel saate göre YYYY-AA-GG (toISOString UTC kullandığı için gece yarısı kayabilir).
function bugun() {
  const t = new Date();
  return tarihMetni(t);
}
function tarihMetni(t) {
  const iki = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${iki(t.getMonth() + 1)}-${iki(t.getDate())}`;
}
function gunEkle(metin, fark) {
  const [y, a, g] = metin.split("-").map(Number);
  return tarihMetni(new Date(y, a - 1, g + fark));
}

// ---------- Ekranı yenile ----------
function yenile() {
  const profil = db.profilGetir();
  if (!profil) return;

  $("#tarih").value = seciliTarih;
  $("#bugun").hidden = seciliTarih === bugun();

  const yemekler = db.kayitlariGetir("yemekler", seciliTarih);
  const sporlar = db.kayitlariGetir("sporlar", seciliTarih);
  const bmr = bmrHesapla(profil.kilo, profil.boy, profil.yas, profil.cinsiyet);
  const ozet = gunlukOzet(yemekler, sporlar, bmr);

  $("#ozet-alinan").textContent = sayi(ozet.alinan);
  $("#ozet-bmr").textContent = sayi(ozet.bmr);
  $("#ozet-yakilan").textContent = sayi(ozet.yakilan);
  const net = $("#ozet-net");
  net.textContent = (ozet.net > 0 ? "+" : "") + sayi(ozet.net);
  net.closest(".kart").dataset.durum = ozet.net > 0 ? "fazla" : "acik";

  $("#sayi-yemekler").textContent = yemekler.length || "";
  $("#sayi-sporlar").textContent = sporlar.length || "";
  listeyiCiz(aktifSekme === "yemekler" ? yemekler : sporlar);
}

function listeyiCiz(kayitlar) {
  const liste = $("#liste");
  liste.replaceChildren();
  if (kayitlar.length === 0) {
    const bos = document.createElement("li");
    bos.className = "bos";
    bos.textContent = aktifSekme === "yemekler" ? "Bu gün için yemek kaydı yok." : "Bu gün için spor kaydı yok.";
    liste.append(bos);
    return;
  }
  for (const k of kayitlar) {
    // Model notları textContent ile yazılır (HTML olarak yorumlanmaz).
    const li = document.createElement("li");
    li.className = "kayit";
    const metin = document.createElement("div");
    metin.className = "kayit-metin";
    const ad = document.createElement("strong");
    ad.textContent = k.ad;
    const not = document.createElement("small");
    not.textContent = k.notlar || "";
    metin.append(ad, not);
    const kcal = document.createElement("span");
    kcal.className = "kayit-kcal";
    kcal.textContent = `${sayi(k.kalori)} kcal`;
    const sil = document.createElement("button");
    sil.className = "sil";
    sil.setAttribute("aria-label", "Kaydı sil");
    sil.textContent = "✕";
    sil.onclick = async () => {
      if (!confirm(`"${k.ad}" silinsin mi?`)) return;
      await db.kayitSil(aktifSekme, k.id);
      yenile();
    };
    li.append(metin, kcal, sil);
    liste.append(li);
  }
}

// ---------- Sekmeler ----------
function sekmeSec(sekme) {
  aktifSekme = sekme;
  for (const b of document.querySelectorAll(".sekme")) {
    b.setAttribute("aria-selected", String(b.dataset.sekme === sekme));
  }
  const yemek = sekme === "yemekler";
  $("#giris-etiket").textContent = yemek ? "Ne yediniz?" : "Hangi egzersizi ne kadar yaptınız?";
  $("#giris").placeholder = yemek ? "örn. 200 gram pilav, margarita pizza 2 dilim" : "örn. 30 dakika koşu";
  $("#durum").textContent = "";
  yenile();
}

// ---------- Kayıt ekleme (API çağrısı) ----------
async function ekle(olay) {
  olay.preventDefault();
  const metin = $("#giris").value.trim();
  if (!metin) return;
  const tablo = aktifSekme;
  const tarih = seciliTarih;
  const buton = $("#ekle");
  buton.disabled = true;
  buton.textContent = "Hesaplanıyor…";
  $("#durum").textContent = "";
  delete $("#durum").dataset.hata;
  try {
    const sonuc = tablo === "yemekler"
      ? await yemekKalorisi(metin)
      : await sporKalorisi(metin, db.profilGetir().kilo);
    await db.kayitEkle(tablo, tarih, metin, sonuc.kalori, sonuc.not);
    $("#giris").value = "";
    $("#durum").textContent = `Eklendi: ${metin} → ${sayi(sonuc.kalori)} kcal`;
    yenile();
  } catch (hata) {
    const mesaj = hata instanceof YapayZekaHatasi ? hata.message : `Beklenmeyen hata: ${hata.message}`;
    $("#durum").textContent = mesaj;
    $("#durum").dataset.hata = "1";
    alert(mesaj);
  } finally {
    buton.disabled = false;
    buton.textContent = "Hesapla ve Ekle";
  }
}

// ---------- Ayarlar / Profil ----------
function ayarlariAc() {
  const profil = db.profilGetir();
  const form = $("#ayar-form");
  form.boy.value = profil?.boy ?? "";
  form.kilo.value = profil?.kilo ?? "";
  form.yas.value = profil?.yas ?? "";
  form.cinsiyet.value = profil?.cinsiyet ?? "erkek";
  form.anahtar.value = anahtarGetir();
  // İlk açılışta profil olmadan pencere kapatılamaz.
  $("#ayar-kapat").hidden = !profil;
  $("#ayar-baslik").textContent = profil ? "Ayarlar" : "Hoş geldiniz! Bilgilerinizi girin";
  $("#ayarlar").showModal();
}

async function ayarlariKaydet(olay) {
  olay.preventDefault();
  const form = $("#ayar-form");
  const boy = Number(form.boy.value.replace(",", "."));
  const kilo = Number(form.kilo.value.replace(",", "."));
  const yas = Number(form.yas.value);
  if (!(boy >= 50 && boy <= 250 && kilo >= 20 && kilo <= 400 && Number.isInteger(yas) && yas >= 10 && yas <= 120)) {
    alert("Lütfen geçerli değerler girin.\nBoy: 50-250 cm, Kilo: 20-400 kg, Yaş: 10-120");
    return;
  }
  await db.profilKaydet(boy, kilo, form.cinsiyet.value, yas);
  anahtarKaydet(form.anahtar.value.trim());
  $("#ayarlar").close();
  yenile();
}

// Yedek: veritabanını .db dosyası olarak indir.
function yedekIndir() {
  const blob = new Blob([db.disaAktar()], { type: "application/x-sqlite3" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `kalori_takip_${bugun()}.db`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function yedekYukle(olay) {
  const dosya = olay.target.files[0];
  olay.target.value = "";
  if (!dosya) return;
  if (!confirm("Mevcut tüm kayıtlar bu yedekle değiştirilecek. Devam edilsin mi?")) return;
  try {
    await db.iceAktar(new Uint8Array(await dosya.arrayBuffer()));
    alert("Yedek yüklendi.");
    $("#ayarlar").close();
    if (db.profilGetir()) yenile(); else ayarlariAc();
  } catch {
    alert("Bu dosya geçerli bir yedek değil.");
  }
}

// ---------- Başlangıç ----------
async function basla() {
  db = await Veritabani.ac();

  $("#onceki").onclick = () => { seciliTarih = gunEkle(seciliTarih, -1); yenile(); };
  $("#sonraki").onclick = () => { seciliTarih = gunEkle(seciliTarih, 1); yenile(); };
  $("#bugun").onclick = () => { seciliTarih = bugun(); yenile(); };
  $("#tarih").onchange = (o) => { if (o.target.value) { seciliTarih = o.target.value; yenile(); } };
  for (const b of document.querySelectorAll(".sekme")) b.onclick = () => sekmeSec(b.dataset.sekme);
  $("#giris-form").onsubmit = ekle;
  $("#ayar-ac").onclick = ayarlariAc;
  $("#ayar-kapat").onclick = () => $("#ayarlar").close();
  $("#ayar-form").onsubmit = ayarlariKaydet;
  $("#yedek-indir").onclick = yedekIndir;
  $("#yedek-yukle").onchange = yedekYukle;
  // Profil yokken Esc ile pencerenin kapanmasını engelle.
  $("#ayarlar").addEventListener("cancel", (o) => { if (!db.profilGetir()) o.preventDefault(); });

  sekmeSec("yemekler");
  // İlk açılış: profil yoksa bilgileri iste; varsa geçmiş kayıtlar zaten yüklendi.
  if (!db.profilGetir()) ayarlariAc();
  document.body.classList.remove("yukleniyor");
}

// Çevrimdışı açılış ve "Ana ekrana ekle" için service worker kaydı.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

basla().catch((hata) => {
  document.body.classList.remove("yukleniyor");
  alert(`Uygulama başlatılamadı: ${hata.message}`);
});
