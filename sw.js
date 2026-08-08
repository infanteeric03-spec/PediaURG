// Service worker — cachea el "app shell" para que la calculadora funcione
// sin conexión una vez instalada, y habilita el aviso de instalación de Chrome.
//
// v2: cambia la estrategia para el documento HTML a "red primero, caché de
// respaldo". Así, en cuanto haya conexión, siempre se ve la última versión
// publicada al instante; la caché solo se usa si el dispositivo está offline.
// Sube el número de versión cada vez que publiques cambios importantes: eso
// fuerza a los navegadores (Chrome, Samsung Internet, etc.) a descartar la
// caché antigua en vez de seguir sirviéndola indefinidamente.
const CACHE_NAME = "husa-dosis-pediatricas-v2";
const APP_SHELL = [
  "./dosis-pediatricas.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const isHTML =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // Documento principal: red primero (siempre la versión más reciente si hay
    // conexión), y si falla (sin conexión), se sirve la última copia guardada.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Resto de archivos (iconos, manifest...): caché primero, y se actualiza en
  // segundo plano — cambian con poca frecuencia, así que prioriza velocidad.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
