const CACHE_NAME = 'Nafs Hay V4';
const ASSETS = [
	'./',
	'./index.html',
	'./manifest.json',
	'./icons/icon-512.png',
  './icons/icon-192.png',
  './styles.css',
  './app.js'
	// Add your controller's main .js or .css filenames here if they are separate files
];

// Install Service Worker and Cache Assets
self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(ASSETS);
		})
	);
});

// Activate and Clear Old Caches
self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

// Network First, Fallback to Cache
self.addEventListener('fetch', (e) => {
	e.respondWith(
		fetch(e.request).catch(() => {
			return caches.match(e.request);
		})
	);
});