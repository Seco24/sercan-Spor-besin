// Anthropic Claude API ile kalori tahmini (masaüstündeki yapay_zeka.py'nin karşılığı).
//
// GÜVENLİK: API anahtarı kodda yoktur. Telefonda ortam değişkeni olmadığı için
// kullanıcı anahtarı Ayarlar ekranına bir kez girer; anahtar yalnızca bu cihazın
// tarayıcı deposunda (localStorage) tutulur ve sadece api.anthropic.com'a gönderilir.

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-5-5";
const ANAHTAR_DEPO_ADI = "anthropic_api_anahtari";

const YEMEK_SISTEM_ISTEMI =
  "Sen bir beslenme asistanısın. Verilen yiyeceğin yaklaşık kalorisini kcal olarak hesapla. " +
  'Yanıtı yalnızca JSON olarak ver: {"kalori": sayı, "not": "kısa açıklama"}. ' +
  "Emin olmadığında bunu not alanında belirt.";

const SPOR_SISTEM_ISTEMI =
  "Sen bir spor ve egzersiz asistanısın. Verilen egzersizde, belirtilen kilodaki bir kişinin " +
  "yaklaşık olarak yaktığı kaloriyi kcal olarak hesapla (MET değerlerini kullanabilirsin). " +
  'Yanıtı yalnızca JSON olarak ver: {"kalori": sayı, "not": "kısa açıklama"}. ' +
  "Emin olmadığında bunu not alanında belirt.";

export class YapayZekaHatasi extends Error {}

export function anahtarGetir() {
  try { return localStorage.getItem(ANAHTAR_DEPO_ADI) || ""; } catch { return ""; }
}

export function anahtarKaydet(anahtar) {
  try {
    if (anahtar) localStorage.setItem(ANAHTAR_DEPO_ADI, anahtar);
    else localStorage.removeItem(ANAHTAR_DEPO_ADI);
  } catch { /* özel sekme vb. durumlarda depolama kapalı olabilir */ }
}

// Model yanıtından {"kalori": ..., "not": ...} nesnesini çıkarır.
// Model JSON'u ``` blokları içine koysa bile ilk {...} bloğu alınır.
export function jsonAyikla(metin) {
  const eslesme = metin.match(/\{[\s\S]*\}/);
  if (!eslesme) throw new YapayZekaHatasi(`Yanıtta JSON bulunamadı: ${metin.slice(0, 200)}`);
  let veri;
  try { veri = JSON.parse(eslesme[0]); } catch {
    throw new YapayZekaHatasi(`Yanıt beklenen biçimde değil: ${metin.slice(0, 200)}`);
  }
  const kalori = Number(veri.kalori);
  if (!Number.isFinite(kalori) || veri.kalori === null || veri.kalori === "") {
    throw new YapayZekaHatasi(`Yanıt beklenen biçimde değil: ${metin.slice(0, 200)}`);
  }
  if (kalori < 0) throw new YapayZekaHatasi("Model negatif bir kalori değeri döndürdü.");
  return { kalori: Math.round(kalori), not: String(veri.not ?? "") };
}

async function sor(sistemIstemi, kullaniciMetni) {
  const apiKey = anahtarGetir();
  if (!apiKey) {
    throw new YapayZekaHatasi("API anahtarı girilmemiş. Lütfen ⚙ Ayarlar'dan anahtarınızı girin.");
  }
  // dangerouslyAllowBrowser: anahtar kullanıcının kendi cihazında, kendi girdiği
  // anahtar olduğu için tarayıcıdan doğrudan çağrıya izin veriyoruz.
  const istemci = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  let yanit;
  try {
    // Basit bir tahmin işi: düşük "effort" yeterli ve hızlıdır.
    // fallbacks: "default" -> model isteği güvenlik nedeniyle reddederse
    // API aynı isteği otomatik olarak uygun bir yedek modelde çalıştırır.
    yanit = await istemci.beta.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: sistemIstemi,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{ role: "user", content: kullaniciMetni }],
    });
  } catch (hata) {
    if (hata instanceof Anthropic.AuthenticationError) throw new YapayZekaHatasi("API anahtarı geçersiz.");
    if (hata instanceof Anthropic.RateLimitError) throw new YapayZekaHatasi("Çok fazla istek gönderildi, biraz bekleyip tekrar deneyin.");
    if (hata instanceof Anthropic.APIConnectionError) throw new YapayZekaHatasi("API'ye bağlanılamadı. İnternet bağlantınızı kontrol edin.");
    if (hata instanceof Anthropic.APIError) throw new YapayZekaHatasi(`API hatası (${hata.status}): ${hata.message}`);
    throw hata;
  }

  if (yanit.stop_reason === "refusal") {
    throw new YapayZekaHatasi("Model bu isteği yanıtlamadı. Lütfen farklı ifade edin.");
  }
  const metin = yanit.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return jsonAyikla(metin);
}

// Örn. "200 gram pilav" -> { kalori: 260, not: "..." }
export const yemekKalorisi = (metin) => sor(YEMEK_SISTEM_ISTEMI, metin);

// Örn. ("30 dakika koşu", 75) -> { kalori: 350, not: "..." }
export const sporKalorisi = (metin, kilo) => sor(SPOR_SISTEM_ISTEMI, `Kilo: ${kilo} kg. Egzersiz: ${metin}`);
