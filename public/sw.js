if (!self.define) {
  let e,
    i = {};
  const a = (a, t) => (
    (a = new URL(a + ".js", t).href),
    i[a] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = i), document.head.appendChild(e);
        } else (e = a), importScripts(a), i();
      }).then(() => {
        let e = i[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (t, n) => {
    const r = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (i[r]) return;
    let s = {};
    const c = (e) => a(e, r),
      o = { module: { uri: r }, exports: s, require: c };
    i[r] = Promise.all(t.map((e) => o[e] || c(e))).then((e) => (n(...e), s));
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
        { url: "/_next/static/chunks/4bd1b696-409494caf8c83275.js", revision: "409494caf8c83275" },
        { url: "/_next/static/chunks/619-f072ac750404f9da.js", revision: "f072ac750404f9da" },
        { url: "/_next/static/chunks/696-cb89b3fcf15e81a7.js", revision: "cb89b3fcf15e81a7" },
        { url: "/_next/static/chunks/720-bfdb25b9848c4d26.js", revision: "bfdb25b9848c4d26" },
        { url: "/_next/static/chunks/757-218d1bb41adf2a1d.js", revision: "218d1bb41adf2a1d" },
        { url: "/_next/static/chunks/884-191efb6f5820767e.js", revision: "191efb6f5820767e" },
        { url: "/_next/static/chunks/896-b58525d1d7bd32e0.js", revision: "b58525d1d7bd32e0" },
        { url: "/_next/static/chunks/97-11a4bcd58cf57476.js", revision: "11a4bcd58cf57476" },
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
        { url: "/_next/static/chunks/app/error-48f98cfb96fef199.js", revision: "48f98cfb96fef199" },
        {
          url: "/_next/static/chunks/app/global-error-8591b6b7c7550550.js",
          revision: "8591b6b7c7550550",
        },
        {
          url: "/_next/static/chunks/app/layout-7b4606912c2dc537.js",
          revision: "7b4606912c2dc537",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        {
          url: "/_next/static/chunks/app/not-found-f64d8450f0539df9.js",
          revision: "f64d8450f0539df9",
        },
        { url: "/_next/static/chunks/app/page-08efb8b4e106591f.js", revision: "08efb8b4e106591f" },
        {
          url: "/_next/static/chunks/app/resume/page-9885d948dc17a0b9.js",
          revision: "9885d948dc17a0b9",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-1e066d3bcdc654f9.js",
          revision: "1e066d3bcdc654f9",
        },
        { url: "/_next/static/chunks/framework-8d6afbd6d2d605c2.js", revision: "8d6afbd6d2d605c2" },
        { url: "/_next/static/chunks/main-9369455ef68cb879.js", revision: "9369455ef68cb879" },
        { url: "/_next/static/chunks/main-app-e747c8c3b8cd23b4.js", revision: "e747c8c3b8cd23b4" },
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
        { url: "/_next/static/chunks/webpack-b1f4e234a4f6318a.js", revision: "b1f4e234a4f6318a" },
        { url: "/_next/static/css/3aca62b3827494e7.css", revision: "3aca62b3827494e7" },
        {
          url: "/_next/static/lok_eLm6gfAp1_xWYixVm/_buildManifest.js",
          revision: "cbfc62b218deca367d07bd3f0d6010ea",
        },
        {
          url: "/_next/static/lok_eLm6gfAp1_xWYixVm/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/inter-cyrillic-400-normal.4cc6e28c.woff",
          revision: "4cc6e28c",
        },
        {
          url: "/_next/static/media/inter-cyrillic-400-normal.547767ef.woff2",
          revision: "547767ef",
        },
        {
          url: "/_next/static/media/inter-cyrillic-500-normal.5ec9103b.woff2",
          revision: "5ec9103b",
        },
        {
          url: "/_next/static/media/inter-cyrillic-500-normal.c1b1edeb.woff",
          revision: "c1b1edeb",
        },
        {
          url: "/_next/static/media/inter-cyrillic-600-normal.8c69e1bb.woff2",
          revision: "8c69e1bb",
        },
        {
          url: "/_next/static/media/inter-cyrillic-600-normal.c0105440.woff",
          revision: "c0105440",
        },
        {
          url: "/_next/static/media/inter-cyrillic-700-normal.571aeb62.woff",
          revision: "571aeb62",
        },
        {
          url: "/_next/static/media/inter-cyrillic-700-normal.9ce56ec3.woff2",
          revision: "9ce56ec3",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-400-normal.2440d5f8.woff2",
          revision: "2440d5f8",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-400-normal.6e13bad4.woff",
          revision: "6e13bad4",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-500-normal.656d5a0e.woff",
          revision: "656d5a0e",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-500-normal.d8f535fc.woff2",
          revision: "d8f535fc",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-600-normal.62fe61a7.woff",
          revision: "62fe61a7",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-600-normal.dd95b020.woff2",
          revision: "dd95b020",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-700-normal.94d4fa7d.woff2",
          revision: "94d4fa7d",
        },
        {
          url: "/_next/static/media/inter-cyrillic-ext-700-normal.9fa0c048.woff",
          revision: "9fa0c048",
        },
        { url: "/_next/static/media/inter-greek-400-normal.573bacd1.woff2", revision: "573bacd1" },
        { url: "/_next/static/media/inter-greek-400-normal.d6adbb78.woff", revision: "d6adbb78" },
        { url: "/_next/static/media/inter-greek-500-normal.947d4ab3.woff2", revision: "947d4ab3" },
        { url: "/_next/static/media/inter-greek-500-normal.af596b86.woff", revision: "af596b86" },
        { url: "/_next/static/media/inter-greek-600-normal.61c756cf.woff", revision: "61c756cf" },
        { url: "/_next/static/media/inter-greek-600-normal.ee808ffe.woff2", revision: "ee808ffe" },
        { url: "/_next/static/media/inter-greek-700-normal.384941e3.woff", revision: "384941e3" },
        { url: "/_next/static/media/inter-greek-700-normal.a094cf2b.woff2", revision: "a094cf2b" },
        {
          url: "/_next/static/media/inter-greek-ext-400-normal.f196e968.woff",
          revision: "f196e968",
        },
        {
          url: "/_next/static/media/inter-greek-ext-400-normal.f8992900.woff2",
          revision: "f8992900",
        },
        {
          url: "/_next/static/media/inter-greek-ext-500-normal.34eb831d.woff",
          revision: "34eb831d",
        },
        {
          url: "/_next/static/media/inter-greek-ext-500-normal.5fe403a5.woff2",
          revision: "5fe403a5",
        },
        {
          url: "/_next/static/media/inter-greek-ext-600-normal.a46b5cba.woff",
          revision: "a46b5cba",
        },
        {
          url: "/_next/static/media/inter-greek-ext-600-normal.d05f940f.woff2",
          revision: "d05f940f",
        },
        {
          url: "/_next/static/media/inter-greek-ext-700-normal.411652e2.woff2",
          revision: "411652e2",
        },
        {
          url: "/_next/static/media/inter-greek-ext-700-normal.fa338c24.woff",
          revision: "fa338c24",
        },
        { url: "/_next/static/media/inter-latin-400-normal.360a94a9.woff2", revision: "360a94a9" },
        { url: "/_next/static/media/inter-latin-400-normal.38abad60.woff", revision: "38abad60" },
        { url: "/_next/static/media/inter-latin-500-normal.7986a549.woff", revision: "7986a549" },
        { url: "/_next/static/media/inter-latin-500-normal.e98e390c.woff2", revision: "e98e390c" },
        { url: "/_next/static/media/inter-latin-600-normal.8ad7b5a9.woff", revision: "8ad7b5a9" },
        { url: "/_next/static/media/inter-latin-600-normal.efad9519.woff2", revision: "efad9519" },
        { url: "/_next/static/media/inter-latin-700-normal.6b51d3fc.woff2", revision: "6b51d3fc" },
        { url: "/_next/static/media/inter-latin-700-normal.ac2885ce.woff", revision: "ac2885ce" },
        {
          url: "/_next/static/media/inter-latin-ext-400-normal.732723e2.woff2",
          revision: "732723e2",
        },
        {
          url: "/_next/static/media/inter-latin-ext-400-normal.d1f6a5a2.woff",
          revision: "d1f6a5a2",
        },
        {
          url: "/_next/static/media/inter-latin-ext-500-normal.8f855dd9.woff2",
          revision: "8f855dd9",
        },
        {
          url: "/_next/static/media/inter-latin-ext-500-normal.b3be213d.woff",
          revision: "b3be213d",
        },
        {
          url: "/_next/static/media/inter-latin-ext-600-normal.43dc1cee.woff2",
          revision: "43dc1cee",
        },
        {
          url: "/_next/static/media/inter-latin-ext-600-normal.8756e10d.woff",
          revision: "8756e10d",
        },
        {
          url: "/_next/static/media/inter-latin-ext-700-normal.a2935e03.woff",
          revision: "a2935e03",
        },
        {
          url: "/_next/static/media/inter-latin-ext-700-normal.e8daf0b5.woff2",
          revision: "e8daf0b5",
        },
        {
          url: "/_next/static/media/inter-vietnamese-400-normal.1411920a.woff",
          revision: "1411920a",
        },
        {
          url: "/_next/static/media/inter-vietnamese-400-normal.de4fc44f.woff2",
          revision: "de4fc44f",
        },
        {
          url: "/_next/static/media/inter-vietnamese-500-normal.7c0a695f.woff2",
          revision: "7c0a695f",
        },
        {
          url: "/_next/static/media/inter-vietnamese-500-normal.c5840ea0.woff",
          revision: "c5840ea0",
        },
        {
          url: "/_next/static/media/inter-vietnamese-600-normal.8b0a74d0.woff",
          revision: "8b0a74d0",
        },
        {
          url: "/_next/static/media/inter-vietnamese-600-normal.9d518599.woff2",
          revision: "9d518599",
        },
        {
          url: "/_next/static/media/inter-vietnamese-700-normal.26a4f6eb.woff",
          revision: "26a4f6eb",
        },
        {
          url: "/_next/static/media/inter-vietnamese-700-normal.c48feea2.woff2",
          revision: "c48feea2",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-400-normal.17524150.woff2",
          revision: "17524150",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-400-normal.c9c6c002.woff",
          revision: "c9c6c002",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-500-normal.9cd5715a.woff",
          revision: "9cd5715a",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-500-normal.ae6258df.woff2",
          revision: "ae6258df",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-ext-400-normal.17463387.woff",
          revision: "17463387",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-ext-400-normal.17d05b18.woff2",
          revision: "17d05b18",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-ext-500-normal.7c5c6997.woff",
          revision: "7c5c6997",
        },
        {
          url: "/_next/static/media/jetbrains-mono-cyrillic-ext-500-normal.d9de1144.woff2",
          revision: "d9de1144",
        },
        {
          url: "/_next/static/media/jetbrains-mono-greek-400-normal.517c450b.woff",
          revision: "517c450b",
        },
        {
          url: "/_next/static/media/jetbrains-mono-greek-400-normal.77d339c7.woff2",
          revision: "77d339c7",
        },
        {
          url: "/_next/static/media/jetbrains-mono-greek-500-normal.89c6cba8.woff2",
          revision: "89c6cba8",
        },
        {
          url: "/_next/static/media/jetbrains-mono-greek-500-normal.ff0aaf5e.woff",
          revision: "ff0aaf5e",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-400-normal.db9d659a.woff2",
          revision: "db9d659a",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-400-normal.e25c3319.woff",
          revision: "e25c3319",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-500-normal.2f466417.woff",
          revision: "2f466417",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-500-normal.af2e87f5.woff2",
          revision: "af2e87f5",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-ext-400-normal.4d63b447.woff2",
          revision: "4d63b447",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-ext-400-normal.dc4026db.woff",
          revision: "dc4026db",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-ext-500-normal.6d23e6f5.woff",
          revision: "6d23e6f5",
        },
        {
          url: "/_next/static/media/jetbrains-mono-latin-ext-500-normal.b7bedb53.woff2",
          revision: "b7bedb53",
        },
        {
          url: "/_next/static/media/jetbrains-mono-vietnamese-400-normal.553f85d1.woff2",
          revision: "553f85d1",
        },
        {
          url: "/_next/static/media/jetbrains-mono-vietnamese-400-normal.f83be352.woff",
          revision: "f83be352",
        },
        {
          url: "/_next/static/media/jetbrains-mono-vietnamese-500-normal.0da0a93b.woff",
          revision: "0da0a93b",
        },
        {
          url: "/_next/static/media/jetbrains-mono-vietnamese-500-normal.3bbdce79.woff2",
          revision: "3bbdce79",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-500-normal.9a625465.woff2",
          revision: "9a625465",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-500-normal.b347750b.woff",
          revision: "b347750b",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-600-normal.4b371524.woff2",
          revision: "4b371524",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-600-normal.ac63a30d.woff",
          revision: "ac63a30d",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-700-normal.315e360b.woff",
          revision: "315e360b",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-700-normal.9ca9285d.woff2",
          revision: "9ca9285d",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-500-normal.064e1076.woff",
          revision: "064e1076",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-500-normal.9cc40c09.woff2",
          revision: "9cc40c09",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-600-normal.8dd98a15.woff2",
          revision: "8dd98a15",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-600-normal.a3fcf117.woff",
          revision: "a3fcf117",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-700-normal.7354930e.woff2",
          revision: "7354930e",
        },
        {
          url: "/_next/static/media/space-grotesk-latin-ext-700-normal.bc1c4a2e.woff",
          revision: "bc1c4a2e",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-500-normal.984bdab9.woff",
          revision: "984bdab9",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-500-normal.b78f9ae9.woff2",
          revision: "b78f9ae9",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-600-normal.17d07667.woff",
          revision: "17d07667",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-600-normal.6a5443c0.woff2",
          revision: "6a5443c0",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-700-normal.636f45c6.woff",
          revision: "636f45c6",
        },
        {
          url: "/_next/static/media/space-grotesk-vietnamese-700-normal.6df28e08.woff2",
          revision: "6df28e08",
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
              var i = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    i && "opaqueredirect" === i.type
                      ? new Response(i.body, { status: 200, statusText: "OK", headers: i.headers })
                      : i,
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
        var i = e.sameOrigin,
          a = e.url.pathname;
        return !(!i || a.startsWith("/api/auth/callback") || !a.startsWith("/api/"));
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
        var i = e.request,
          a = e.url.pathname,
          t = e.sameOrigin;
        return (
          "1" === i.headers.get("RSC") &&
          "1" === i.headers.get("Next-Router-Prefetch") &&
          t &&
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
        var i = e.request,
          a = e.url.pathname,
          t = e.sameOrigin;
        return "1" === i.headers.get("RSC") && t && !a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var i = e.url.pathname;
        return e.sameOrigin && !i.startsWith("/api/");
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
