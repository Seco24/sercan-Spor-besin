"""BMR ve günlük özet hesapları (arayüzden bağımsız, test edilebilir)."""


def bmr_hesapla(kilo, boy, yas, cinsiyet):
    """Mifflin-St Jeor formülü.

    Erkek: 10 × kilo + 6.25 × boy − 5 × yaş + 5
    Kadın: 10 × kilo + 6.25 × boy − 5 × yaş − 161
    """
    taban = 10 * kilo + 6.25 * boy - 5 * yas
    return taban + 5 if cinsiyet == "erkek" else taban - 161


def gunluk_ozet(yemekler, sporlar, bmr):
    """Seçilen günün özetini döndürür.

    Net = alınan kalori − BMR − yakılan spor kalorisi
    (Negatif net değer kalori açığı demektir.)
    """
    alinan = sum(y["kalori"] for y in yemekler)
    yakilan = sum(s["kalori"] for s in sporlar)
    return {
        "alinan": alinan,
        "bmr": bmr,
        "yakilan": yakilan,
        "net": alinan - bmr - yakilan,
    }
