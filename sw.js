// 一度開いたら機内モードでも開けるよう、アプリのファイルをすべて端末にしまう（SPEC 開発の進め方 7 の 4）。
// 通信するのは、最初の読み込みと、新しい版があるか（このファイルが変わったか）の確認だけ。
// 版の名前とファイルの一覧は tool/build_web.ps1 が書き込む。
const VERSION = 'v20261125012310';
const FILES = [".","favicon.png","flutter.js","flutter_bootstrap.js","index.html","main.dart.js","manifest.json","version.json","assets/AssetManifest.bin","assets/AssetManifest.bin.json","assets/FontManifest.json","assets/NOTICES","assets/assets/fonts/BIZUDGothic-Bold.ttf","assets/assets/fonts/BIZUDGothic-Regular.ttf","assets/assets/runner/cat/food_bite1.png","assets/assets/runner/cat/food_bite2.png","assets/assets/runner/cat/food_whole.png","assets/assets/runner/cat/run_0.png","assets/assets/runner/cat/run_1.png","assets/assets/runner/cat/run_2.png","assets/assets/runner/cat/run_3.png","assets/assets/runner/cat/stand.png","assets/assets/runner/duck/food_bite1.png","assets/assets/runner/duck/food_bite2.png","assets/assets/runner/duck/food_whole.png","assets/assets/runner/duck/run_0.png","assets/assets/runner/duck/run_1.png","assets/assets/runner/duck/run_2.png","assets/assets/runner/duck/run_3.png","assets/assets/runner/duck/stand.png","assets/assets/sounds/finish.wav","assets/fonts/MaterialIcons-Regular.otf","assets/fonts/fallback/Roboto-Regular.ttf","assets/packages/flutter_local_notifications_web/web/notifications_service_worker.js","assets/shaders/ink_sparkle.frag","assets/shaders/stretch_effect.frag","canvaskit/canvaskit.js","canvaskit/canvaskit.wasm","icons/apple-touch-icon.png","icons/Icon-192.png","icons/Icon-512.png","icons/Icon-maskable-192.png","icons/Icon-maskable-512.png"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});

// 新しい版にしたら、古い版のファイルは消す
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// 一覧にないもの（ブラウザによって使う描画の仕組みが違う）は、初めて使ったときにしまう
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request).then((res) => {
      if (res.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
      }
      return res;
    })),
  );
});
