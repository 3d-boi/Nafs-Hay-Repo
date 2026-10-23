/**
 * Green City PWA - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initViewSwitching();
    initLeafletMap();
    registerServiceWorker(); // <-- PWA Service Worker Registration
});

// Global reference for Leaflet map
let mapInstance = null;

/**
 * Single-Page Application (SPA) View Switcher
 */
function initViewSwitching() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item[data-target]');
    const views = document.querySelectorAll('.app-view');
    const backToHomeBtn = document.getElementById('btn-map-back');
    const reportBackBtn = document.getElementById('btn-report-back');
    const communityBackBtn = document.getElementById('btn-community-back');
    const accountBackBtn = document.getElementById('btn-account-back');

    // Function to switch view by target ID
    window.switchView = function(targetViewId) {
        views.forEach(view => {
            if (view.id === targetViewId) {
                view.classList.add('active-view');
            } else {
                view.classList.remove('active-view');
            }
        });

        // Update Bottom Nav state
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetViewId) {
                item.classList.add('active');
                if (!item.querySelector('.nav-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'nav-indicator';
                    item.appendChild(indicator);
                }
            } else {
                item.classList.remove('active');
                const indicator = item.querySelector('.nav-indicator');
                if (indicator) indicator.remove();
            }
        });

        // Re-render Leaflet Map size when switching to map view
        if (targetViewId === 'view-map' && mapInstance) {
            setTimeout(() => {
                mapInstance.invalidateSize();
            }, 200);
        }
    };

    // Nav Items click events
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (targetId) switchView(targetId);
        });
    });

    // Back to Home Button in Map Header
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    // Back to Home Button in Report Header
    if (reportBackBtn) {
        reportBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    if (communityBackBtn) {
        communityBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    if (accountBackBtn) {
        accountBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }
}

/**
 * Register Service Worker for PWA Offline Support
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch((error) => {
                    console.error('ServiceWorker registration failed: ', error);
                });
        });
    }
}

/**
 * Initialize Interactive Leaflet Map
 */
function initLeafletMap() {
    // Maadi, Cairo Coordinates
    const maadiLat = 29.9602;
    const maadiLng = 31.2569;

    // Initialize map
    mapInstance = L.map('leaflet-map-canvas', {
        zoomControl: false,
        attributionControl: true
    }).setView([maadiLat, maadiLng], 14);

    // Esri Topo Map Layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri'
    }).addTo(mapInstance);

    // Custom Markers Data
    const locations = [
        {
            title: "حديقة الحي السابع - المعادي",
            lat: 29.9602,
            lng: 31.2569,
            type: "tertiary",
            label: "قيد التطوير",
            icon: "energy_savings_leaf"
        },
        {
            title: "ممشى دجلة الأخضر",
            lat: 29.9680,
            lng: 31.2650,
            type: "secondary",
            label: "ممشى دجلة الأخضر",
            icon: "park"
        },
        {
            title: "أشجار جافة - شارع 9",
            lat: 29.9540,
            lng: 31.2500,
            type: "error",
            label: "أشجار جافة",
            icon: "warning"
        }
    ];

    // Add Custom Markers to Map
    locations.forEach(loc => {
        const markerHtml = `
            <div class="marker-pin-wrapper">
                <div class="marker-label label-${loc.type}">${loc.label}</div>
                <div class="marker-bubble bubble-${loc.type}">
                    <span class="material-symbols-outlined icon-sm">${loc.icon}</span>
                </div>
            </div>
        `;

        const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-marker',
            iconSize: [80, 50],
            iconAnchor: [40, 45]
        });

        L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
    });

    // Wire Up Map Controls
    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');
    const recenterBtn = document.getElementById('btn-recenter');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => mapInstance.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => mapInstance.zoomOut());
    if (recenterBtn) {
        recenterBtn.addEventListener('click', () => {
            mapInstance.flyTo([maadiLat, maadiLng], 14, { duration: 1.2 });
        });
    }
}