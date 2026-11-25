// Egzersiz MET değerleri.
// Kaynak: 2024 Adult Compendium of Physical Activities (https://pacompendium.com)
// Herrmann SD ve ark., J Sport Health Sci 2024. "kod" Compendium aktivite kodudur.
//
// Yakılan kalori ≈ MET × kilo (kg) × süre (saat)

export const SPORLAR = [
  { adlar: ["koşu", "koşmak", "orta tempo koşu"], met: 9.3, kod: "12050", aciklama: "Koşu, ~10 km/s" },
  { adlar: ["hafif koşu", "yavaş koşu", "jogging", "hafif tempo koşu"], met: 7.5, kod: "12020", aciklama: "Hafif koşu (jogging), kendi temposunda" },
  { adlar: ["hızlı koşu", "tempolu koşu"], met: 11.0, kod: "12070", aciklama: "Koşu, ~11 km/s" },
  { adlar: ["yürüyüş", "yürümek", "normal yürüyüş"], met: 3.8, kod: "17190", aciklama: "Yürüyüş, orta tempo (4.5–5.5 km/s)" },
  { adlar: ["yavaş yürüyüş", "hafif yürüyüş"], met: 2.8, kod: "17152", aciklama: "Yürüyüş, yavaş (3–4 km/s)" },
  { adlar: ["hızlı yürüyüş", "tempolu yürüyüş", "spor yürüyüşü"], met: 4.8, kod: "17200", aciklama: "Yürüyüş, hızlı (5.6–6.3 km/s)" },
  { adlar: ["doğa yürüyüşü", "trekking", "dağ yürüyüşü"], met: 6.0, kod: "17080", aciklama: "Doğa yürüyüşü" },
  { adlar: ["merdiven çıkma", "merdiven çıkmak", "merdiven"], met: 6.8, kod: "17131", aciklama: "Merdiven çıkma, genel" },
  { adlar: ["bisiklet", "bisiklet sürmek"], met: 7.0, kod: "01014", aciklama: "Bisiklet, genel" },
  { adlar: ["yavaş bisiklet", "hafif bisiklet"], met: 5.8, kod: "01019", aciklama: "Bisiklet, keyif için (~15 km/s)" },
  { adlar: ["kondisyon bisikleti", "sabit bisiklet", "spinning"], met: 6.8, kod: "01200", aciklama: "Sabit bisiklet, genel" },
  { adlar: ["yüzme", "yüzmek"], met: 6.0, kod: "18310", aciklama: "Yüzme, genel (tur atmadan)" },
  { adlar: ["kulaç yüzme", "serbest stil yüzme"], met: 5.8, kod: "18240", aciklama: "Serbest stil, yavaş/rekreasyonel" },
  { adlar: ["futbol", "halı saha", "halısaha", "top oynamak"], met: 7.0, kod: "15610", aciklama: "Futbol, gündelik" },
  { adlar: ["basketbol"], met: 7.5, kod: "15055", aciklama: "Basketbol, genel" },
  { adlar: ["voleybol"], met: 4.0, kod: "15710", aciklama: "Voleybol" },
  { adlar: ["tenis"], met: 6.8, kod: "15675", aciklama: "Tenis, orta efor" },
  { adlar: ["masa tenisi", "pinpon"], met: 4.0, kod: "15660", aciklama: "Masa tenisi" },
  { adlar: ["badminton"], met: 5.5, kod: "15030", aciklama: "Badminton, sosyal" },
  { adlar: ["ip atlama", "ip atlamak"], met: 11.8, kod: "15551", aciklama: "İp atlama, orta tempo" },
  { adlar: ["ağırlık", "ağırlık antrenmanı", "fitness", "spor salonu", "gym", "salon"], met: 3.5, kod: "02054", aciklama: "Ağırlık antrenmanı, çoklu egzersiz" },
  { adlar: ["ağır ağırlık", "vücut geliştirme"], met: 6.0, kod: "02050", aciklama: "Ağırlık, güç/vücut geliştirme" },
  { adlar: ["şınav mekik", "kalistenik", "vücut ağırlığı egzersizi"], met: 3.8, kod: "02022", aciklama: "Kalistenik, orta efor" },
  { adlar: ["pilates"], met: 2.8, kod: "02105", aciklama: "Pilates, genel" },
  { adlar: ["yoga"], met: 2.3, kod: "02175", aciklama: "Yoga, genel" },
  { adlar: ["eliptik", "eliptik bisiklet"], met: 5.0, kod: "02048", aciklama: "Eliptik, orta efor" },
  { adlar: ["kürek makinesi", "kürek çekme"], met: 5.0, kod: "02071", aciklama: "Kürek ergometresi, orta efor" },
  { adlar: ["aerobik", "zumba"], met: 7.3, kod: "02000", aciklama: "Aerobik, genel" },
  { adlar: ["dans"], met: 6.0, kod: "03042", aciklama: "Dans, eğlence amaçlı" },
  { adlar: ["boks", "kum torbası"], met: 5.8, kod: "15110", aciklama: "Boks, kum torbası" },
];
