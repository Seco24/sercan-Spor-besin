// BMR ve günlük özet hesapları (masaüstü sürümündeki hesaplama.py ile aynı).

// Mifflin-St Jeor: erkek 10×kilo + 6.25×boy − 5×yaş + 5, kadın aynı formülde −161
export function bmrHesapla(kilo, boy, yas, cinsiyet) {
  const taban = 10 * kilo + 6.25 * boy - 5 * yas;
  return cinsiyet === "erkek" ? taban + 5 : taban - 161;
}

// Net = alınan − BMR − sporla yakılan (negatif değer kalori açığıdır)
export function gunlukOzet(yemekler, sporlar, bmr) {
  const alinan = yemekler.reduce((t, y) => t + y.kalori, 0);
  const yakilan = sporlar.reduce((t, s) => t + s.kalori, 0);
  return { alinan, bmr, yakilan, net: alinan - bmr - yakilan };
}
