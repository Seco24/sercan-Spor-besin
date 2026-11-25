// OTOMATİK ÜRETİLDİ: mobil/veri/besin_tablosu_olustur.py
// Kaynak: USDA FoodData Central SR Legacy (kamu malı). kcal100 = 100 g'daki kalori,
// birimler = 1 birimin gram karşılığı.
export const BESINLER = [
 {
  "adlar": [
   "yumurta",
   "haşlanmış yumurta",
   "haslanmis yumurta",
   "katı yumurta",
   "rafadan yumurta"
  ],
  "kcal100": 155.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 50.0
  },
  "kaynak": "USDA FDC 173424: Egg, whole, cooked, hard-boiled"
 },
 {
  "adlar": [
   "sahanda yumurta",
   "yumurta sahanda",
   "kızarmış yumurta"
  ],
  "kcal100": 196.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 46.0
  },
  "kaynak": "USDA FDC 173423: Egg, whole, cooked, fried"
 },
 {
  "adlar": [
   "süt",
   "tam yağlı süt"
  ],
  "kcal100": 61.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "bardak": 200,
   "ml": 1
  },
  "kaynak": "USDA FDC 171265: Milk, whole, 3.25% milkfat, with added vitamin D"
 },
 {
  "adlar": [
   "yarım yağlı süt"
  ],
  "kcal100": 51.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "bardak": 200,
   "ml": 1
  },
  "kaynak": "USDA FDC 170870: Milk, reduced fat, fluid, 2% milkfat, with added nonfat milk solids and vitamin A and vitamin D"
 },
 {
  "adlar": [
   "light süt",
   "az yağlı süt"
  ],
  "kcal100": 42.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "bardak": 200,
   "ml": 1
  },
  "kaynak": "USDA FDC 170872: Milk, lowfat, fluid, 1% milkfat, with added vitamin A and vitamin D"
 },
 {
  "adlar": [
   "yoğurt",
   "tam yağlı yoğurt"
  ],
  "kcal100": 61.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "kase": 200,
   "yemek kaşığı": 15
  },
  "kaynak": "USDA FDC 171284: Yogurt, plain, whole milk"
 },
 {
  "adlar": [
   "az yağlı yoğurt",
   "light yoğurt"
  ],
  "kcal100": 63.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "kase": 200,
   "yemek kaşığı": 15
  },
  "kaynak": "USDA FDC 170886: Yogurt, plain, low fat"
 },
 {
  "adlar": [
   "beyaz peynir",
   "feta peyniri",
   "feta"
  ],
  "kcal100": 265.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "dilim": 30,
   "kibrit kutusu": 30
  },
  "kaynak": "USDA FDC 173420: Cheese, feta"
 },
 {
  "adlar": [
   "tereyağı"
  ],
  "kcal100": 717.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yemek kaşığı": 14.2,
   "çay kaşığı": 5.0
  },
  "kaynak": "USDA FDC 173410: Butter, salted"
 },
 {
  "adlar": [
   "ekmek",
   "beyaz ekmek",
   "francala"
  ],
  "kcal100": 266.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "dilim": 29.0
  },
  "kaynak": "USDA FDC 174924: Bread, white, commercially prepared (includes soft bread crumbs)"
 },
 {
  "adlar": [
   "tam buğday ekmeği",
   "tam buğday ekmek",
   "kepekli ekmek"
  ],
  "kcal100": 252.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "dilim": 32.0
  },
  "kaynak": "USDA FDC 172688: Bread, whole-wheat, commercially prepared"
 },
 {
  "adlar": [
   "haşlanmış pirinç",
   "sade pirinç",
   "haşlanmış beyaz pirinç"
  ],
  "kcal100": 130.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 131.7
  },
  "kaynak": "USDA FDC 168878: Rice, white, long-grain, regular, enriched, cooked"
 },
 {
  "adlar": [
   "haşlanmış bulgur",
   "sade bulgur"
  ],
  "kcal100": 83.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 151.7
  },
  "kaynak": "USDA FDC 170287: Bulgur, cooked"
 },
 {
  "adlar": [
   "haşlanmış makarna",
   "sade makarna"
  ],
  "kcal100": 158.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 103.3
  },
  "kaynak": "USDA FDC 169737: Pasta, cooked, enriched, without added salt"
 },
 {
  "adlar": [
   "yulaf",
   "yulaf ezmesi"
  ],
  "kcal100": 379.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 67.5,
   "yemek kaşığı": 7
  },
  "kaynak": "USDA FDC 173904: Cereals, oats, regular and quick, not fortified, dry"
 },
 {
  "adlar": [
   "haşlanmış mercimek"
  ],
  "kcal100": 116.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 165.0
  },
  "kaynak": "USDA FDC 172421: Lentils, mature seeds, cooked, boiled, without salt"
 },
 {
  "adlar": [
   "haşlanmış nohut"
  ],
  "kcal100": 164.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 136.7
  },
  "kaynak": "USDA FDC 173757: Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt"
 },
 {
  "adlar": [
   "haşlanmış kuru fasulye",
   "haşlanmış barbunya"
  ],
  "kcal100": 127.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 147.5
  },
  "kaynak": "USDA FDC 173740: Beans, kidney, all types, mature seeds, cooked, boiled, without salt"
 },
 {
  "adlar": [
   "haşlanmış patates"
  ],
  "kcal100": 87.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 136.0
  },
  "kaynak": "USDA FDC 170438: Potatoes, boiled, cooked in skin, flesh, without salt"
 },
 {
  "adlar": [
   "fırında patates",
   "fırın patates"
  ],
  "kcal100": 93.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 173.0
  },
  "kaynak": "USDA FDC 170093: Potatoes, baked, flesh and skin, without salt"
 },
 {
  "adlar": [
   "fırında tatlı patates",
   "tatlı patates"
  ],
  "kcal100": 90.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 114.0
  },
  "kaynak": "USDA FDC 168483: Sweet potato, cooked, baked in skin, flesh, without salt"
 },
 {
  "adlar": [
   "haşlanmış mısır",
   "mısır"
  ],
  "kcal100": 96.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 124.2,
   "adet": 118.0
  },
  "kaynak": "USDA FDC 169999: Corn, sweet, yellow, cooked, boiled, drained, without salt"
 },
 {
  "adlar": [
   "tavuk göğsü",
   "ızgara tavuk göğsü",
   "fırında tavuk göğsü"
  ],
  "kcal100": 165.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 171477: Chicken, broilers or fryers, breast, meat only, cooked, roasted"
 },
 {
  "adlar": [
   "hindi göğsü",
   "fırında hindi göğsü"
  ],
  "kcal100": 136.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 174516: Turkey, retail parts, breast, meat only, cooked, roasted"
 },
 {
  "adlar": [
   "somon",
   "ızgara somon",
   "fırında somon"
  ],
  "kcal100": 206.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 175168: Fish, salmon, Atlantic, farmed, cooked, dry heat"
 },
 {
  "adlar": [
   "elma"
  ],
  "kcal100": 52.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 182.0
  },
  "kaynak": "USDA FDC 171688: Apples, raw, with skin (Includes foods for USDA's Food Distribution Program)"
 },
 {
  "adlar": [
   "muz"
  ],
  "kcal100": 89.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 118.0
  },
  "kaynak": "USDA FDC 173944: Bananas, raw"
 },
 {
  "adlar": [
   "portakal"
  ],
  "kcal100": 47.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 184.0
  },
  "kaynak": "USDA FDC 169097: Oranges, raw, all commercial varieties"
 },
 {
  "adlar": [
   "armut"
  ],
  "kcal100": 57.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 178.0
  },
  "kaynak": "USDA FDC 169118: Pears, raw"
 },
 {
  "adlar": [
   "mandalina"
  ],
  "kcal100": 53.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 88.0
  },
  "kaynak": "USDA FDC 169105: Tangerines, (mandarin oranges), raw"
 },
 {
  "adlar": [
   "şeftali"
  ],
  "kcal100": 39.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 150.0
  },
  "kaynak": "USDA FDC 169928: Peaches, yellow, raw"
 },
 {
  "adlar": [
   "kayısı"
  ],
  "kcal100": 48.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 35.0
  },
  "kaynak": "USDA FDC 171697: Apricots, raw"
 },
 {
  "adlar": [
   "kiraz"
  ],
  "kcal100": 63.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 8.2,
   "su bardağı": 115.0
  },
  "kaynak": "USDA FDC 171719: Cherries, sweet, raw"
 },
 {
  "adlar": [
   "çilek"
  ],
  "kcal100": 32.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 12.0,
   "su bardağı": 126.7
  },
  "kaynak": "USDA FDC 167762: Strawberries, raw"
 },
 {
  "adlar": [
   "üzüm"
  ],
  "kcal100": 69.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 125.8
  },
  "kaynak": "USDA FDC 174683: Grapes, red or green (European type, such as Thompson seedless), raw"
 },
 {
  "adlar": [
   "karpuz"
  ],
  "kcal100": 30.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "dilim": 286.0
  },
  "kaynak": "USDA FDC 167765: Watermelon, raw"
 },
 {
  "adlar": [
   "kavun"
  ],
  "kcal100": 34.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169092: Melons, cantaloupe, raw"
 },
 {
  "adlar": [
   "kivi"
  ],
  "kcal100": 61.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 69.0
  },
  "kaynak": "USDA FDC 168153: Kiwifruit, green, raw"
 },
 {
  "adlar": [
   "incir",
   "taze incir"
  ],
  "kcal100": 74.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 50.0
  },
  "kaynak": "USDA FDC 173021: Figs, raw"
 },
 {
  "adlar": [
   "kuru incir"
  ],
  "kcal100": 249.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 8.4
  },
  "kaynak": "USDA FDC 174665: Figs, dried, uncooked"
 },
 {
  "adlar": [
   "kuru kayısı"
  ],
  "kcal100": 241.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 7
  },
  "kaynak": "USDA FDC 173941: Apricots, dried, sulfured, uncooked"
 },
 {
  "adlar": [
   "hurma"
  ],
  "kcal100": 277.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 24.0
  },
  "kaynak": "USDA FDC 168191: Dates, medjool"
 },
 {
  "adlar": [
   "nar"
  ],
  "kcal100": 83.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 282.0
  },
  "kaynak": "USDA FDC 169134: Pomegranates, raw"
 },
 {
  "adlar": [
   "erik"
  ],
  "kcal100": 46.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 66.0
  },
  "kaynak": "USDA FDC 169949: Plums, raw"
 },
 {
  "adlar": [
   "ananas"
  ],
  "kcal100": 50.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169124: Pineapple, raw, all varieties"
 },
 {
  "adlar": [
   "mango"
  ],
  "kcal100": 60.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 336.0
  },
  "kaynak": "USDA FDC 169910: Mangos, raw"
 },
 {
  "adlar": [
   "yaban mersini"
  ],
  "kcal100": 57.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 123.3
  },
  "kaynak": "USDA FDC 171711: Blueberries, raw"
 },
 {
  "adlar": [
   "avokado"
  ],
  "kcal100": 160.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 201.0
  },
  "kaynak": "USDA FDC 171705: Avocados, raw, all commercial varieties"
 },
 {
  "adlar": [
   "portakal suyu",
   "taze portakal suyu",
   "taze sıkılmış portakal suyu"
  ],
  "kcal100": 45.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 200,
   "bardak": 200,
   "ml": 1
  },
  "kaynak": "USDA FDC 169098: Orange juice, raw (Includes foods for USDA's Food Distribution Program)"
 },
 {
  "adlar": [
   "domates"
  ],
  "kcal100": 18.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 123.0
  },
  "kaynak": "USDA FDC 170457: Tomatoes, red, ripe, raw, year round average"
 },
 {
  "adlar": [
   "salatalık",
   "hıyar"
  ],
  "kcal100": 15.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 100
  },
  "kaynak": "USDA FDC 168409: Cucumber, with peel, raw"
 },
 {
  "adlar": [
   "havuç"
  ],
  "kcal100": 41.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 61.0
  },
  "kaynak": "USDA FDC 170393: Carrots, raw"
 },
 {
  "adlar": [
   "soğan",
   "kuru soğan"
  ],
  "kcal100": 40.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 110.0
  },
  "kaynak": "USDA FDC 170000: Onions, raw"
 },
 {
  "adlar": [
   "yeşil biber"
  ],
  "kcal100": 20.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 170427: Peppers, sweet, green, raw"
 },
 {
  "adlar": [
   "kırmızı biber"
  ],
  "kcal100": 26.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 170108: Peppers, sweet, red, raw"
 },
 {
  "adlar": [
   "marul"
  ],
  "kcal100": 17.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yaprak": 6.0
  },
  "kaynak": "USDA FDC 169247: Lettuce, cos or romaine, raw"
 },
 {
  "adlar": [
   "ıspanak",
   "çiğ ıspanak"
  ],
  "kcal100": 23.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 168462: Spinach, raw"
 },
 {
  "adlar": [
   "brokoli",
   "çiğ brokoli"
  ],
  "kcal100": 34.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 170379: Broccoli, raw"
 },
 {
  "adlar": [
   "karnabahar",
   "çiğ karnabahar"
  ],
  "kcal100": 25.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169986: Cauliflower, raw"
 },
 {
  "adlar": [
   "lahana",
   "beyaz lahana"
  ],
  "kcal100": 25.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169975: Cabbage, raw"
 },
 {
  "adlar": [
   "mantar",
   "çiğ mantar"
  ],
  "kcal100": 22.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169251: Mushrooms, white, raw"
 },
 {
  "adlar": [
   "patlıcan",
   "çiğ patlıcan"
  ],
  "kcal100": 25.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169228: Eggplant, raw"
 },
 {
  "adlar": [
   "kabak",
   "çiğ kabak"
  ],
  "kcal100": 17.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 169291: Squash, summer, zucchini, includes skin, raw"
 },
 {
  "adlar": [
   "haşlanmış taze fasulye"
  ],
  "kcal100": 35.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "su bardağı": 104.2
  },
  "kaynak": "USDA FDC 169141: Beans, snap, green, cooked, boiled, drained, without salt"
 },
 {
  "adlar": [
   "siyah zeytin"
  ],
  "kcal100": 116.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 4.4
  },
  "kaynak": "USDA FDC 169094: Olives, ripe, canned (small-extra large)"
 },
 {
  "adlar": [
   "badem"
  ],
  "kcal100": 579.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30,
   "adet": 1.2
  },
  "kaynak": "USDA FDC 170567: Nuts, almonds"
 },
 {
  "adlar": [
   "fındık"
  ],
  "kcal100": 628.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30,
   "adet": 1.4
  },
  "kaynak": "USDA FDC 170581: Nuts, hazelnuts or filberts"
 },
 {
  "adlar": [
   "ceviz"
  ],
  "kcal100": 654.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30
  },
  "kaynak": "USDA FDC 170187: Nuts, walnuts, english"
 },
 {
  "adlar": [
   "yer fıstığı",
   "fıstık"
  ],
  "kcal100": 587.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30
  },
  "kaynak": "USDA FDC 173806: Peanuts, all types, dry-roasted, without salt"
 },
 {
  "adlar": [
   "antep fıstığı"
  ],
  "kcal100": 572.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30
  },
  "kaynak": "USDA FDC 170185: Nuts, pistachio nuts, dry roasted, without salt added"
 },
 {
  "adlar": [
   "kaju"
  ],
  "kcal100": 553.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30
  },
  "kaynak": "USDA FDC 170162: Nuts, cashew nuts, raw"
 },
 {
  "adlar": [
   "ay çekirdeği içi"
  ],
  "kcal100": 584.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "avuç": 30
  },
  "kaynak": "USDA FDC 170562: Seeds, sunflower seed kernels, dried"
 },
 {
  "adlar": [
   "zeytinyağı"
  ],
  "kcal100": 884.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yemek kaşığı": 13.5,
   "çay kaşığı": 4.5
  },
  "kaynak": "USDA FDC 171413: Oil, olive, salad or cooking"
 },
 {
  "adlar": [
   "şeker",
   "toz şeker"
  ],
  "kcal100": 387.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "çay kaşığı": 4.2,
   "tatlı kaşığı": 8,
   "yemek kaşığı": 12.5,
   "küp": 2.3
  },
  "kaynak": "USDA FDC 169655: Sugars, granulated"
 },
 {
  "adlar": [
   "küp şeker"
  ],
  "kcal100": 387.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "adet": 2.3
  },
  "kaynak": "USDA FDC 169655: Sugars, granulated"
 },
 {
  "adlar": [
   "bal"
  ],
  "kcal100": 304.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yemek kaşığı": 21.0,
   "tatlı kaşığı": 10,
   "çay kaşığı": 7
  },
  "kaynak": "USDA FDC 169640: Honey"
 },
 {
  "adlar": [
   "reçel"
  ],
  "kcal100": 278.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yemek kaşığı": 20.0,
   "tatlı kaşığı": 10,
   "çay kaşığı": 7
  },
  "kaynak": "USDA FDC 169641: Jams and preserves"
 },
 {
  "adlar": [
   "fıstık ezmesi"
  ],
  "kcal100": 598.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "yemek kaşığı": 16.0
  },
  "kaynak": "USDA FDC 172470: Peanut butter, smooth style, without salt"
 },
 {
  "adlar": [
   "bitter çikolata"
  ],
  "kcal100": 598.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 170273: Chocolate, dark, 70-85% cacao solids"
 },
 {
  "adlar": [
   "sütlü çikolata"
  ],
  "kcal100": 535.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000
  },
  "kaynak": "USDA FDC 167587: Candies, milk chocolate"
 },
 {
  "adlar": [
   "çay",
   "sade çay",
   "şekersiz çay"
  ],
  "kcal100": 1.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "çay bardağı": 100,
   "bardak": 100,
   "fincan": 100
  },
  "kaynak": "USDA FDC 173227: Beverages, tea, black, brewed, prepared with tap water"
 },
 {
  "adlar": [
   "filtre kahve",
   "sade filtre kahve"
  ],
  "kcal100": 1.0,
  "birimler": {
   "gram": 1,
   "gr": 1,
   "g": 1,
   "kg": 1000,
   "kupa": 240,
   "fincan": 150
  },
  "kaynak": "USDA FDC 171890: Beverages, coffee, brewed, prepared with tap water"
 }
];
