"""USDA FoodData Central (SR Legacy) verisinden uygulamanın hazır besin tablosunu üretir.

Kaynak: USDA FoodData Central, SR Legacy (2018-04), kamu malı (CC0).
  https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip

Kullanım:
  python besin_tablosu_olustur.py <zip'ten çıkan klasör>
Çıktı: ../src/veri/besinler.js

Her besin için:
  - kalori (kcal/100 g)          -> USDA'dan
  - birim ağırlıkları (gram)     -> "usda:<ölçü>" ise USDA porsiyon tablosundan,
                                     sayı ise yaygın Türk ölçüsü (tahmini)
Türk ölçüleri: su bardağı = 200 ml (USDA "cup" 240 ml'nin 5/6'sı), çay bardağı = 100 ml.
"""

import csv
import json
import sys
from pathlib import Path

# (Türkçe adlar, USDA fdc_id, birimler)
# Birim değeri: "usda:<porsiyon açıklamasında geçen ifade>" ya da gram sayısı.
# "su bardağı": "usda:cup" yazılırsa USDA cup ağırlığının 5/6'sı alınır.
BESINLER = [
    # --- Yumurta, süt ürünleri ---
    (["yumurta", "haşlanmış yumurta", "haslanmis yumurta", "katı yumurta", "rafadan yumurta"], 173424, {"adet": "usda:large"}),
    (["sahanda yumurta", "yumurta sahanda", "kızarmış yumurta"], 173423, {"adet": "usda:large"}),
    (["süt", "tam yağlı süt"], 171265, {"su bardağı": 200, "bardak": 200, "ml": 1}),
    (["yarım yağlı süt"], 170870, {"su bardağı": 200, "bardak": 200, "ml": 1}),
    (["light süt", "az yağlı süt"], 170872, {"su bardağı": 200, "bardak": 200, "ml": 1}),
    (["yoğurt", "tam yağlı yoğurt"], 171284, {"su bardağı": 200, "kase": 200, "yemek kaşığı": 15}),
    (["az yağlı yoğurt", "light yoğurt"], 170886, {"su bardağı": 200, "kase": 200, "yemek kaşığı": 15}),
    (["beyaz peynir", "feta peyniri", "feta"], 173420, {"dilim": 30, "kibrit kutusu": 30}),
    (["tereyağı"], 173410, {"yemek kaşığı": "usda:tbsp", "çay kaşığı": "usda:pat"}),
    # --- Ekmek, tahıl, baklagil ---
    (["ekmek", "beyaz ekmek", "francala"], 174924, {"dilim": "usda:slice"}),
    (["tam buğday ekmeği", "tam buğday ekmek", "kepekli ekmek"], 172688, {"dilim": "usda:slice"}),
    (["haşlanmış pirinç", "sade pirinç", "haşlanmış beyaz pirinç"], 168878, {"su bardağı": "usda:cup"}),
    (["haşlanmış bulgur", "sade bulgur"], 170287, {"su bardağı": "usda:cup"}),
    (["haşlanmış makarna", "sade makarna"], 169737, {"su bardağı": "usda:cup"}),
    (["yulaf", "yulaf ezmesi"], 173904, {"su bardağı": "usda:cup", "yemek kaşığı": 7}),
    (["haşlanmış mercimek"], 172421, {"su bardağı": "usda:cup"}),
    (["haşlanmış nohut"], 173757, {"su bardağı": "usda:cup"}),
    (["haşlanmış kuru fasulye", "haşlanmış barbunya"], 173740, {"su bardağı": "usda:cup"}),
    (["haşlanmış patates"], 170438, {"adet": "usda:potato"}),
    (["fırında patates", "fırın patates"], 170093, {"adet": "usda:medium"}),
    (["fırında tatlı patates", "tatlı patates"], 168483, {"adet": "usda:medium"}),
    (["haşlanmış mısır", "mısır"], 169999, {"su bardağı": "usda:cup", "adet": "usda:large"}),
    # --- Et, balık ---
    (["tavuk göğsü", "ızgara tavuk göğsü", "fırında tavuk göğsü"], 171477, {}),
    (["hindi göğsü", "fırında hindi göğsü"], 174516, {}),
    (["somon", "ızgara somon", "fırında somon"], 175168, {}),
    # --- Meyve ---
    (["elma"], 171688, {"adet": "usda:medium"}),
    (["muz"], 173944, {"adet": "usda:medium"}),
    (["portakal"], 169097, {"adet": "usda:large"}),
    (["armut"], 169118, {"adet": "usda:medium"}),
    (["mandalina"], 169105, {"adet": "usda:medium"}),
    (["şeftali"], 169928, {"adet": "usda:medium"}),
    (["kayısı"], 171697, {"adet": "usda:apricot"}),
    (["kiraz"], 171719, {"adet": "usda:cherry", "su bardağı": "usda:cup"}),
    (["çilek"], 167762, {"adet": "usda:medium", "su bardağı": "usda:cup"}),
    (["üzüm"], 174683, {"su bardağı": "usda:cup"}),
    (["karpuz"], 167765, {"dilim": "usda:wedge"}),
    (["kavun"], 169092, {}),
    (["kivi"], 168153, {"adet": "usda:fruit"}),
    (["incir", "taze incir"], 173021, {"adet": "usda:medium"}),
    (["kuru incir"], 174665, {"adet": "usda:fig"}),
    (["kuru kayısı"], 173941, {"adet": 7}),  # USDA yalnızca yarım kayısıyı veriyor
    (["hurma"], 168191, {"adet": "usda:date"}),
    (["nar"], 169134, {"adet": "usda:pomegranate"}),
    (["erik"], 169949, {"adet": "usda:fruit"}),
    (["ananas"], 169124, {}),
    (["mango"], 169910, {"adet": "usda:fruit"}),
    (["yaban mersini"], 171711, {"su bardağı": "usda:cup"}),
    (["avokado"], 171705, {"adet": "usda:avocado"}),
    (["portakal suyu", "taze portakal suyu", "taze sıkılmış portakal suyu"], 169098, {"su bardağı": 200, "bardak": 200, "ml": 1}),
    # --- Sebze ---
    (["domates"], 170457, {"adet": "usda:medium"}),
    (["salatalık", "hıyar"], 168409, {"adet": 100}),
    (["havuç"], 170393, {"adet": "usda:medium"}),
    (["soğan", "kuru soğan"], 170000, {"adet": "usda:medium"}),
    (["yeşil biber"], 170427, {}),
    (["kırmızı biber"], 170108, {}),
    (["marul"], 169247, {"yaprak": "usda:leaf"}),
    (["ıspanak", "çiğ ıspanak"], 168462, {}),
    (["brokoli", "çiğ brokoli"], 170379, {}),
    (["karnabahar", "çiğ karnabahar"], 169986, {}),
    (["lahana", "beyaz lahana"], 169975, {}),
    (["mantar", "çiğ mantar"], 169251, {}),
    (["patlıcan", "çiğ patlıcan"], 169228, {}),
    (["kabak", "çiğ kabak"], 169291, {}),
    (["haşlanmış taze fasulye"], 169141, {"su bardağı": "usda:cup"}),
    (["siyah zeytin"], 169094, {"adet": "usda:large"}),
    # --- Kuruyemiş ---
    (["badem"], 170567, {"avuç": 30, "adet": "usda:almond"}),
    (["fındık"], 170581, {"avuç": 30, "adet": "usda:nut"}),
    (["ceviz"], 170187, {"avuç": 30}),
    (["yer fıstığı", "fıstık"], 173806, {"avuç": 30}),
    (["antep fıstığı"], 170185, {"avuç": 30}),
    (["kaju"], 170162, {"avuç": 30}),
    (["ay çekirdeği içi"], 170562, {"avuç": 30}),
    # --- Yağ, tatlı, içecek ---
    (["zeytinyağı"], 171413, {"yemek kaşığı": "usda:tablespoon", "çay kaşığı": "usda:tsp"}),
    (["şeker", "toz şeker"], 169655, {"çay kaşığı": "usda:tsp", "tatlı kaşığı": 8, "yemek kaşığı": 12.5, "küp": "usda:cube"}),
    (["küp şeker"], 169655, {"adet": "usda:cube"}),
    (["bal"], 169640, {"yemek kaşığı": "usda:tbsp", "tatlı kaşığı": 10, "çay kaşığı": 7}),
    (["reçel"], 169641, {"yemek kaşığı": "usda:tbsp", "tatlı kaşığı": 10, "çay kaşığı": 7}),
    (["fıstık ezmesi"], 172470, {"yemek kaşığı": "usda:tbsp"}),
    (["bitter çikolata"], 170273, {}),
    (["sütlü çikolata"], 167587, {}),
    (["çay", "sade çay", "şekersiz çay"], 173227, {"çay bardağı": 100, "bardak": 100, "fincan": 100}),
    (["filtre kahve", "sade filtre kahve"], 171890, {"kupa": 240, "fincan": 150}),
]


def main(klasor):
    d = Path(klasor)
    kalori, aciklama, porsiyonlar = {}, {}, {}
    for r in csv.DictReader(open(d / "food_nutrient.csv", encoding="utf-8")):
        if r["nutrient_id"] == "1008":  # Energy (kcal)
            kalori[int(r["fdc_id"])] = float(r["amount"])
    for r in csv.DictReader(open(d / "food.csv", encoding="utf-8")):
        aciklama[int(r["fdc_id"])] = r["description"]
    for r in csv.DictReader(open(d / "food_portion.csv", encoding="utf-8")):
        metin = f'{r["amount"]} {r["portion_description"]} {r["modifier"]}'.strip()
        porsiyonlar.setdefault(int(r["fdc_id"]), []).append((metin, float(r["amount"] or 1), float(r["gram_weight"])))

    cikti, hatalar = [], []
    for adlar, fdc, birimler in BESINLER:
        if fdc not in kalori:
            hatalar.append(f"{adlar[0]}: fdc {fdc} bulunamadı")
            continue
        gramlar = {"gram": 1, "gr": 1, "g": 1, "kg": 1000}
        for birim, deger in birimler.items():
            if isinstance(deger, str) and deger.startswith("usda:"):
                aranan = deger[5:]
                uygun = [p for p in porsiyonlar.get(fdc, []) if aranan in p[0]]
                if not uygun:
                    secenekler = [p[0] for p in porsiyonlar.get(fdc, [])]
                    hatalar.append(f"{adlar[0]}: '{aranan}' ölçüsü yok. Seçenekler: {secenekler}")
                    continue
                metin, miktar, gram = uygun[0]
                g = gram / miktar  # "2 slices" gibi çoklu porsiyonları teke indir
                if birim == "su bardağı" and "cup" in aranan:
                    g = g * 200 / 240  # ABD cup (240 ml) -> Türk su bardağı (200 ml)
                gramlar[birim] = round(g, 1)
            else:
                gramlar[birim] = deger
        cikti.append({
            "adlar": adlar,
            "kcal100": kalori[fdc],
            "birimler": gramlar,
            "kaynak": f"USDA FDC {fdc}: {aciklama[fdc]}",
        })

    if hatalar:
        print("\n".join(hatalar))
        sys.exit(1)

    hedef = Path(__file__).resolve().parent.parent / "src" / "veri" / "besinler.js"
    hedef.write_text(
        "// OTOMATİK ÜRETİLDİ: mobil/veri/besin_tablosu_olustur.py\n"
        "// Kaynak: USDA FoodData Central SR Legacy (kamu malı). kcal100 = 100 g'daki kalori,\n"
        "// birimler = 1 birimin gram karşılığı.\n"
        "export const BESINLER = " + json.dumps(cikti, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(cikti)} besin yazıldı -> {hedef}")


if __name__ == "__main__":
    main(sys.argv[1])
