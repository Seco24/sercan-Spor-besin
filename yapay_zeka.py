"""Anthropic Claude API ile kalori tahmini.

API anahtarı koda yazılmaz; ANTHROPIC_API_KEY ortam değişkeninden okunur.
"""

import json
import os
import re

import anthropic

MODEL = "claude-opus-5-5"

YEMEK_SISTEM_ISTEMI = (
    "Sen bir beslenme asistanısın. Verilen yiyeceğin yaklaşık kalorisini kcal olarak hesapla. "
    'Yanıtı yalnızca JSON olarak ver: {"kalori": sayı, "not": "kısa açıklama"}. '
    "Emin olmadığında bunu not alanında belirt."
)

SPOR_SISTEM_ISTEMI = (
    "Sen bir spor ve egzersiz asistanısın. Verilen egzersizde, belirtilen kilodaki bir kişinin "
    "yaklaşık olarak yaktığı kaloriyi kcal olarak hesapla (MET değerlerini kullanabilirsin). "
    'Yanıtı yalnızca JSON olarak ver: {"kalori": sayı, "not": "kısa açıklama"}. '
    "Emin olmadığında bunu not alanında belirt."
)


class YapayZekaHatasi(Exception):
    """Kullanıcıya gösterilecek, anlaşılır hata mesajı taşır."""


_istemci = None


def _istemci_al():
    # İstemci ilk ihtiyaçta oluşturulur; anahtar yoksa net bir uyarı verilir.
    global _istemci
    if _istemci is None:
        if not os.environ.get("ANTHROPIC_API_KEY"):
            raise YapayZekaHatasi(
                "ANTHROPIC_API_KEY ortam değişkeni bulunamadı. "
                "Lütfen API anahtarınızı ortam değişkeni olarak tanımlayın."
            )
        _istemci = anthropic.Anthropic()  # Anahtarı ortam değişkeninden kendisi okur.
    return _istemci


def json_ayikla(metin):
    """Model yanıtından {"kalori": ..., "not": ...} nesnesini çıkarır.

    Model bazen JSON'u ``` blokları içine koyabilir; ilk {...} bloğu alınır.
    """
    eslesme = re.search(r"\{.*\}", metin, re.DOTALL)
    if not eslesme:
        raise YapayZekaHatasi(f"Yanıtta JSON bulunamadı: {metin[:200]}")
    try:
        veri = json.loads(eslesme.group(0))
        kalori = float(veri["kalori"])
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        raise YapayZekaHatasi(f"Yanıt beklenen biçimde değil: {metin[:200]}")
    if kalori < 0:
        raise YapayZekaHatasi("Model negatif bir kalori değeri döndürdü.")
    return {"kalori": round(kalori), "not": str(veri.get("not", ""))}


def _sor(sistem_istemi, kullanici_metni):
    istemci = _istemci_al()
    try:
        # Basit bir tahmin işi olduğu için düşük "effort" yeterli ve hızlıdır.
        # fallbacks="default": model isteği güvenlik nedeniyle reddederse
        # API aynı isteği otomatik olarak uygun bir yedek modelde çalıştırır.
        yanit = istemci.beta.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=sistem_istemi,
            output_config={"effort": "low"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            messages=[{"role": "user", "content": kullanici_metni}],
        )
    except anthropic.AuthenticationError:
        raise YapayZekaHatasi("API anahtarı geçersiz.")
    except anthropic.RateLimitError:
        raise YapayZekaHatasi("Çok fazla istek gönderildi, biraz bekleyip tekrar deneyin.")
    except anthropic.APIStatusError as e:
        raise YapayZekaHatasi(f"API hatası ({e.status_code}): {e.message}")
    except anthropic.APIConnectionError:
        raise YapayZekaHatasi("API'ye bağlanılamadı. İnternet bağlantınızı kontrol edin.")

    if yanit.stop_reason == "refusal":
        raise YapayZekaHatasi("Model bu isteği yanıtlamadı. Lütfen farklı ifade edin.")

    metin = "".join(b.text for b in yanit.content if b.type == "text")
    return json_ayikla(metin)


def yemek_kalorisi(yemek_metni):
    """Örn. '200 gram pilav' -> {'kalori': 260, 'not': '...'}"""
    return _sor(YEMEK_SISTEM_ISTEMI, yemek_metni)


def spor_kalorisi(spor_metni, kilo):
    """Örn. ('30 dakika koşu', 75) -> {'kalori': 350, 'not': '...'}"""
    return _sor(SPOR_SISTEM_ISTEMI, f"Kilo: {kilo} kg. Egzersiz: {spor_metni}")
