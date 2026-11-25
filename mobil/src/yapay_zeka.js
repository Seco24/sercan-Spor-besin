// Yapay zeka ile kalori tahmini (masaüstündeki yapay_zeka.py'nin karşılığı).
// İki sağlayıcı desteklenir:
//   - "gemini": Google Gemini API, ücretsiz katman (kredi kartı gerekmez, günlük sınırı var)
//   - "claude": Anthropic Claude API (ücretli)
//
// GÜVENLİK: API anahtarları kodda yoktur. Telefonda ortam değişkeni olmadığı için
// kullanıcı anahtarı Ayarlar ekranına bir kez girer; anahtar yalnızca bu cihazın
// tarayıcı deposunda (localStorage) tutulur ve sadece ilgili sağlayıcıya gönderilir.

import Anthropic from "@anthropic-ai/sdk";

const CLAUDE_MODEL = "claude-opus-5-5";
// "-latest" takma adı Google'ın güncel Flash-Lite modelini gösterir;
// ücretsiz katmanda en yüksek günlük kullanım sınırı genelde bu modeldedir.
const GEMINI_MODEL = "gemini-flash-lite-latest";

const DEPO = {
  saglayici: "yapay_zeka_saglayici",
  claude: "anthropic_api_anahtari",
  gemini: "gemini_api_anahtari",
};

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

function depoOku(ad) {
  try { return localStorage.getItem(ad) || ""; } catch { return ""; }
}

function depoYaz(ad, deger) {
  try {
    if (deger) localStorage.setItem(ad, deger);
    else localStorage.removeItem(ad);
  } catch { /* özel sekme vb. durumlarda depolama kapalı olabilir */ }
}

// Seçili sağlayıcı. Daha önce Claude anahtarı girmiş biri Claude'da kalır,
// yeni kullanıcılar ücretsiz Gemini ile başlar.
export function saglayiciGetir() {
  const kayitli = depoOku(DEPO.saglayici);
  if (kayitli === "claude" || kayitli === "gemini") return kayitli;
  return depoOku(DEPO.claude) ? "claude" : "gemini";
}

export function saglayiciKaydet(saglayici) {
  depoYaz(DEPO.saglayici, saglayici);
}

export function anahtarGetir(saglayici = saglayiciGetir()) {
  return depoOku(DEPO[saglayici]);
}

export function anahtarKaydet(saglayici, anahtar) {
  depoYaz(DEPO[saglayici], anahtar);
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
  const saglayici = saglayiciGetir();
  const apiKey = anahtarGetir(saglayici);
  if (!apiKey) {
    throw new YapayZekaHatasi("API anahtarı girilmemiş. Lütfen ⚙ Ayarlar'dan anahtarınızı girin.");
  }
  const metin = saglayici === "gemini"
    ? await geminiSor(apiKey, sistemIstemi, kullaniciMetni)
    : await claudeSor(apiKey, sistemIstemi, kullaniciMetni);
  return jsonAyikla(metin);
}

// ---------- Google Gemini (ücretsiz katman) ----------
async function geminiSor(apiKey, sistemIstemi, kullaniciMetni) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  let yanit;
  try {
    yanit = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistemIstemi }] },
        contents: [{ role: "user", parts: [{ text: kullaniciMetni }] }],
        // Yanıtın yalnızca JSON olmasını iste.
        generationConfig: { responseMimeType: "application/json" },
      }),
    });
  } catch {
    throw new YapayZekaHatasi("Gemini'ye bağlanılamadı. İnternet bağlantınızı kontrol edin.");
  }

  const veri = await yanit.json().catch(() => ({}));
  if (!yanit.ok) {
    const mesaj = veri?.error?.message || "";
    if (yanit.status === 429) {
      throw new YapayZekaHatasi("Ücretsiz kullanım sınırına ulaşıldı. Bir dakika bekleyin; devam ederse günlük sınır dolmuştur, yarın tekrar deneyin.");
    }
    if (yanit.status === 400 && /api key/i.test(mesaj)) throw new YapayZekaHatasi("Gemini API anahtarı geçersiz.");
    if (yanit.status === 403) throw new YapayZekaHatasi("Gemini API anahtarının bu işlem için izni yok. Anahtarı kontrol edin.");
    throw new YapayZekaHatasi(`Gemini hatası (${yanit.status}): ${mesaj}`);
  }

  if (veri.promptFeedback?.blockReason) {
    throw new YapayZekaHatasi("Model bu isteği yanıtlamadı. Lütfen farklı ifade edin.");
  }
  const parcalar = veri.candidates?.[0]?.content?.parts ?? [];
  const metin = parcalar.map((p) => p.text ?? "").join("");
  if (!metin) throw new YapayZekaHatasi("Gemini boş yanıt döndürdü, tekrar deneyin.");
  return metin;
}

// ---------- Anthropic Claude (ücretli) ----------
async function claudeSor(apiKey, sistemIstemi, kullaniciMetni) {
  // dangerouslyAllowBrowser: anahtar kullanıcının kendi cihazında, kendi girdiği
  // anahtar olduğu için tarayıcıdan doğrudan çağrıya izin veriyoruz.
  const istemci = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  let yanit;
  try {
    // Basit bir tahmin işi: düşük "effort" yeterli ve hızlıdır.
    // fallbacks: "default" -> model isteği güvenlik nedeniyle reddederse
    // API aynı isteği otomatik olarak uygun bir yedek modelde çalıştırır.
    yanit = await istemci.beta.messages.create({
      model: CLAUDE_MODEL,
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
  return yanit.content.filter((b) => b.type === "text").map((b) => b.text).join("");
}

// Örn. "200 gram pilav" -> { kalori: 260, not: "..." }
export const yemekKalorisi = (metin) => sor(YEMEK_SISTEM_ISTEMI, metin);

// Örn. ("30 dakika koşu", 75) -> { kalori: 350, not: "..." }
export const sporKalorisi = (metin, kilo) => sor(SPOR_SISTEM_ISTEMI, `Kilo: ${kilo} kg. Egzersiz: ${metin}`);
