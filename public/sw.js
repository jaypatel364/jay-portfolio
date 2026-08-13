if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, n) => {
    const i = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[i]) return;
    let t = {};
    const f = (e) => a(e, i),
      d = { module: { uri: i }, exports: t, require: f };
    s[i] = Promise.all(c.map((e) => d[e] || f(e))).then((e) => (n(...e), t));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/static/chunks/30a37ab2-1871d103bfc6b054.js", revision: "1871d103bfc6b054" },
        { url: "/_next/static/chunks/370-c60ef118332f96b4.js", revision: "c60ef118332f96b4" },
        { url: "/_next/static/chunks/4bd1b696-409494caf8c83275.js", revision: "409494caf8c83275" },
        { url: "/_next/static/chunks/619-f072ac750404f9da.js", revision: "f072ac750404f9da" },
        { url: "/_next/static/chunks/696-47f688d190ea1dfa.js", revision: "47f688d190ea1dfa" },
        { url: "/_next/static/chunks/720-7c503373571041c5.js", revision: "7c503373571041c5" },
        { url: "/_next/static/chunks/757-445dcc870d91f5f3.js", revision: "445dcc870d91f5f3" },
        { url: "/_next/static/chunks/884-b3c41df896dcaf44.js", revision: "b3c41df896dcaf44" },
        {
          url: "/_next/static/chunks/app/_not-found/page-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        {
          url: "/_next/static/chunks/app/api/contact/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        {
          url: "/_next/static/chunks/app/layout-9d7fc0440fa72321.js",
          revision: "9d7fc0440fa72321",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        {
          url: "/_next/static/chunks/app/not-found-f64d8450f0539df9.js",
          revision: "f64d8450f0539df9",
        },
        { url: "/_next/static/chunks/app/page-f12d6666e230b202.js", revision: "f12d6666e230b202" },
        {
          url: "/_next/static/chunks/app/resume/page-c11d8f85d49551f8.js",
          revision: "c11d8f85d49551f8",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        { url: "/_next/static/chunks/framework-3457b9c2619cdd96.js", revision: "3457b9c2619cdd96" },
        { url: "/_next/static/chunks/main-aebda1c240a67433.js", revision: "aebda1c240a67433" },
        { url: "/_next/static/chunks/main-app-3d31e59a5eeddc34.js", revision: "3d31e59a5eeddc34" },
        {
          url: "/_next/static/chunks/pages/_app-5addca2b3b969fde.js",
          revision: "5addca2b3b969fde",
        },
        {
          url: "/_next/static/chunks/pages/_error-022e4ac7bbb9914f.js",
          revision: "022e4ac7bbb9914f",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        { url: "/_next/static/chunks/webpack-c2f0710e8c7fa4ec.js", revision: "c2f0710e8c7fa4ec" },
        { url: "/_next/static/css/50a5d362af52077f.css", revision: "50a5d362af52077f" },
        { url: "/_next/static/css/70136b2bc0ff95b9.css", revision: "70136b2bc0ff95b9" },
        {
          url: "/_next/static/iR25lc0i5s3nm4UraeXji/_buildManifest.js",
          revision: "cbfc62b218deca367d07bd3f0d6010ea",
        },
        {
          url: "/_next/static/iR25lc0i5s3nm4UraeXji/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/36966cca54120369-s.p.woff2",
          revision: "25ea4a783c12103f175f5b157b7d96aa",
        },
        {
          url: "/_next/static/media/558ca1a6aa3cb55e-s.p.woff2",
          revision: "570751c5f8b418972c1976160ba6ed85",
        },
        {
          url: "/_next/static/media/64d784ea54a4acde-s.woff2",
          revision: "8a5b33d747f0cfaac631ad00bd5bcba2",
        },
        {
          url: "/_next/static/media/6d831b18ae5b01dc-s.woff2",
          revision: "e6155c5cfacf3867c500daf0ebcba222",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/ac0e76ddaeeb7981-s.woff2",
          revision: "6465b62dd12646a816e0d80f024ab07f",
        },
        {
          url: "/_next/static/media/b7387a63dd068245-s.woff2",
          revision: "dea099b7d5a5ea45bd4367f8aeff62ab",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e1aab0933260df4d-s.woff2",
          revision: "207f8e9f3761dbd724063a177d906a99",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        {
          url: "/_next/static/media/edc640959b0c7826-s.woff2",
          revision: "5508edf7c10fe677025b8c88a2578acb",
        },
        {
          url: "/_next/static/media/ff71da380fbe67dd-s.woff2",
          revision: "60d32697500d4779da3725134067ad31",
        },
        { url: "/icons/README.md", revision: "64c0f33bcbd0ff8f6e95ae2f5f1c2cc3" },
        { url: "/icons/icon-192.png", revision: "955696cb63f83f8787e51d027776a60b" },
        { url: "/icons/icon-512.png", revision: "955696cb63f83f8787e51d027776a60b" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/robots.txt", revision: "359dadabd212c52b6b3b0f7a2e9a4403" },
        { url: "/swe-worker-5c72df51bb1f6ee0.js", revision: "76fdd3369f623a3edcf74ce2200bfdd0" },
        { url: "/vercel.svg", revision: "61c6b19abff40ea7acd577be818f3976" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var s = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    s && "opaqueredirect" === s.type
                      ? new Response(s.body, { status: 200, statusText: "OK", headers: s.headers })
                      : s,
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var s = e.sameOrigin,
          a = e.url.pathname;
        return !(!s || a.startsWith("/api/auth/callback") || !a.startsWith("/api/"));
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var s = e.request,
          a = e.url.pathname,
          c = e.sameOrigin;
        return (
          "1" === s.headers.get("RSC") &&
          "1" === s.headers.get("Next-Router-Prefetch") &&
          c &&
          !a.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var s = e.request,
          a = e.url.pathname,
          c = e.sameOrigin;
        return "1" === s.headers.get("RSC") && c && !a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var s = e.url.pathname;
        return e.sameOrigin && !s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
