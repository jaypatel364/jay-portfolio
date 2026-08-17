/* Unregisters leftover next-pwa workers from older deploys. Safe to delete after a few weeks. */
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      var keys = await caches.keys();
      await Promise.all(
        keys.map(function (k) {
          return caches.delete(k);
        }),
      );
      await self.registration.unregister();
      var clients = await self.clients.matchAll({ type: "window" });
      clients.forEach(function (client) {
        if (client.navigate) client.navigate(client.url);
      });
    })(),
  );
});
