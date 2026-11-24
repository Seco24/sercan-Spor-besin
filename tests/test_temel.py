"""Arayüz ve API olmadan çalışan temel testler:  python -m unittest"""

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from hesaplama import bmr_hesapla, gunluk_ozet
from veritabani import Veritabani
from yapay_zeka import YapayZekaHatasi, json_ayikla


class TestHesaplama(unittest.TestCase):
    def test_bmr_erkek(self):
        # 10*80 + 6.25*180 - 5*30 + 5 = 1780
        self.assertAlmostEqual(bmr_hesapla(80, 180, 30, "erkek"), 1780)

    def test_bmr_kadin(self):
        # 10*60 + 6.25*165 - 5*25 - 161 = 1345.25
        self.assertAlmostEqual(bmr_hesapla(60, 165, 25, "kadın"), 1345.25)

    def test_net(self):
        ozet = gunluk_ozet([{"kalori": 1500}, {"kalori": 700}], [{"kalori": 300}], 1780)
        self.assertEqual(ozet["alinan"], 2200)
        self.assertEqual(ozet["yakilan"], 300)
        self.assertEqual(ozet["net"], 2200 - 1780 - 300)


class TestJson(unittest.TestCase):
    def test_duz(self):
        self.assertEqual(json_ayikla('{"kalori": 260, "not": "pişmiş pilav"}')["kalori"], 260)

    def test_kod_blogu(self):
        sonuc = json_ayikla('```json\n{"kalori": "540.4", "not": "tahmini"}\n```')
        self.assertEqual(sonuc["kalori"], 540)

    def test_hatali(self):
        with self.assertRaises(YapayZekaHatasi):
            json_ayikla("bilmiyorum")


class TestVeritabani(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.yol = os.path.join(self.gecici.name, "test.db")
        self.db = Veritabani(self.yol)

    def tearDown(self):
        self.db.kapat()
        self.gecici.cleanup()

    def test_profil_ve_kalicilik(self):
        self.assertIsNone(self.db.profil_getir())
        self.db.profil_kaydet(180, 80, "erkek", 30)
        self.db.profil_kaydet(180, 78, "erkek", 30)  # güncelleme
        self.db.yemek_ekle("2026-11-24", "200 gram pilav", 260, "not")
        self.db.spor_ekle("2026-11-24", "30 dakika koşu", 350)
        self.db.kapat()

        # Yeniden açınca geçmiş kayıtlar yüklenmeli.
        self.db = Veritabani(self.yol)
        self.assertEqual(self.db.profil_getir()["kilo"], 78)
        self.assertEqual(len(self.db.yemekleri_getir("2026-11-24")), 1)
        self.assertEqual(len(self.db.sporlari_getir("2026-11-24")), 1)
        self.assertEqual(self.db.yemekleri_getir("2026-11-23"), [])


if __name__ == "__main__":
    unittest.main()
