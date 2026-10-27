/**
 * Green City PWA - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initViewSwitching();
    initLeafletMap();
    registerServiceWorker(); // <-- PWA Service Worker Registration
    initLoginHandlers();     // <-- Login Form & Password Toggle Handlers
    initSignUpHandlers();    // <-- Sign Up Routing & Password Toggle Handlers
});

// Global reference for Leaflet map
let mapInstance = null;

/**
 * Global Helper: Interactive Chip Toggle for Interests
 */
window.toggleInterest = function(buttonElement) {
    if (!buttonElement) return;
    const isCurrentlyActive = buttonElement.classList.contains('chip-active');
    if (isCurrentlyActive) {
        buttonElement.classList.remove('chip-active');
        buttonElement.classList.add('chip-inactive');
    } else {
        buttonElement.classList.add('chip-active');
        buttonElement.classList.remove('chip-inactive');
    }
};

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
    const openAccountBtn = document.getElementById('btn-open-account');
    const blogBackBtn = document.getElementById('btn-blog-back');
    const loginBackBtn = document.getElementById('btn-login-back');
    const initiativesBackBtn = document.getElementById('btn-initiatives-back');
    const ideaBackBtn = document.getElementById('btn-idea-back');

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

    // Open site directly on the Login view by default
    switchView('view-login');

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
    if (openAccountBtn) {
        openAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-account');
        });
    }
    if (blogBackBtn) {
        blogBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }
    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    // Back Button for Initiatives List Screen
    if (initiativesBackBtn) {
        initiativesBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    // Back Button for Add Idea Screen
    if (ideaBackBtn) {
        ideaBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('view-home');
        });
    }

    // Link Home Screen "إبلاغ عن مكان" card to Report View
    const reportActionCard = document.querySelector('.quick-actions-grid .action-card');
    if (reportActionCard) {
        reportActionCard.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-report');
            }
        });
    }

    // Link Home Screen "انضم لمبادرة" card to Initiatives List View
    const actionCards = document.querySelectorAll('.quick-actions-grid .action-card');
    if (actionCards.length > 1) {
        actionCards[1].addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-initiatives');
            }
        });
    }

    // Link Home Screen "اقترح فكرة" card to Add Idea View
    if (actionCards.length > 2) {
        actionCards[2].addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-add-idea');
            }
        });
    }

    // Link Home Screen "عرض الكل" button to Initiatives List View
    const viewAllInitiativesBtn = document.querySelector('#view-home .section-block .section-link');
    if (viewAllInitiativesBtn) {
        viewAllInitiativesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-initiatives');
            }
        });
    }

    // Link Community Screen "أضف فكرة" / action buttons to Add Idea View
    const communityAddIdeaBtn = document.querySelector('#view-community .motivation-banner button, #view-community .btn-add-idea');
    if (communityAddIdeaBtn) {
        communityAddIdeaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-add-idea');
            }
        });
    }
}

/**
 * Login Form and Password Visibility Handlers
 */
function initLoginHandlers() {
    // Password visibility toggle
    const toggleBtn = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password-field');
    const eyeIcon = document.getElementById('eye-icon');

    if (toggleBtn && passwordField && eyeIcon) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordField.type === 'password';
            passwordField.type = isPassword ? 'text' : 'password';
            eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
            toggleBtn.setAttribute('aria-label', isPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
        });
    }

    // Handle Login Submit to transition to Home View
    const loginForm = document.querySelector('#view-login form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-home');
            }
        });
    }

    // Link from Login view -> Sign Up view
    const linkToSignUp = document.querySelector('.login-signup-link');
    if (linkToSignUp) {
        linkToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-signup');
            }
        });
    }
}

/**
 * Sign Up Form, Routing, and Password Visibility Handlers
 */
function initSignUpHandlers() {
    // Link from Sign Up view -> Login view
    const linkToLogin = document.getElementById('link-to-login');
    if (linkToLogin) {
        linkToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-login');
            }
        });
    }

    // Sign Up password visibility toggle
    const toggleSignupBtn = document.getElementById('toggle-signup-password');
    const signupPasswordField = document.getElementById('signup-password-field');
    const signupEyeIcon = document.getElementById('signup-eye-icon');

    if (toggleSignupBtn && signupPasswordField && signupEyeIcon) {
        toggleSignupBtn.addEventListener('click', () => {
            const isPassword = signupPasswordField.type === 'password';
            signupPasswordField.type = isPassword ? 'text' : 'password';
            signupEyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
            toggleSignupBtn.setAttribute('aria-label', isPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
        });
    }

    // Sign Up primary CTA button -> Home View
    const signupSubmitBtn = document.getElementById('btn-signup-submit');
    if (signupSubmitBtn) {
        signupSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-home');
            }
        });
    }

    // Handle form submission via Enter key inside Sign Up form
    const signupForm = document.querySelector('#view-signup form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof window.switchView === 'function') {
                window.switchView('view-home');
            }
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