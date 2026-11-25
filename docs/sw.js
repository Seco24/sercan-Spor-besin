// Service worker: uygulama dosyalarını önbelleğe alır, böylece internet yokken de açılır.
// (Kalori hesaplama yine internet ister; API isteklerine dokunulmaz.)
// Dosyalar değiştiğinde SURUM'u artırın, telefondaki eski önbellek yenilenir.
const SURUM = "kalori-takip-v4";
const DOSYALAR = [
  "./", "./index.html", "./stil.css", "./app.bundle.js",
  "./sql-wasm.js", "./sql-wasm.wasm", "./manifest.webmanifest", "./ikon-192.png", "./ikon-512.png",
];

self.addEventListener("install", (o) => {
  o.waitUntil(caches.open(SURUM).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (o) => {
  o.waitUntil(
    caches.keys()
      .then((adlar) => Promise.all(adlar.filter((a) => a !== SURUM).map((a) => caches.delete(a))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (o) => {
  const url = new URL(o.request.url);
  if (o.request.method !== "GET" || url.origin !== location.origin) return; // API çağrıları ağdan gider
  // Önce ağ, olmazsa önbellek: güncellemeler hemen gelir, çevrimdışı da çalışır.
  o.respondWith(
    fetch(o.request)
      .then((yanit) => {
        const kopya = yanit.clone();
        caches.open(SURUM).then((c) => c.put(o.request, kopya));
        return yanit;
      })
      .catch(() => caches.match(o.request, { ignoreSearch: true }))
  );
});
