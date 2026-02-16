// PWA Setup & Configuration
// Add this script to your toolbox app to enable PWA features

(function() {
    'use strict';

    // ========================================
    // SERVICE WORKER REGISTRATION
    // ========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('./service-worker-firebase.js');
                console.log('✅ Firebase Service Worker registered:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        });
    }

    // ========================================
    // INSTALL PROMPT
    // ========================================
    let deferredPrompt;
    const installButton = document.getElementById('pwa-install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show install button
        if (installButton) {
            installButton.style.display = 'block';
        }
    });

    // Install button click handler
    if (installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) {
                return;
            }

            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('✅ PWA installed');
            } else {
                console.log('❌ PWA installation declined');
            }

            // Clear the deferred prompt
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA was installed');
        deferredPrompt = null;
    });

    // ========================================
    // PUSH NOTIFICATIONS
    // ========================================
    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('❌ This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    async function subscribeToPushNotifications() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log('❌ Push notifications not supported');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                // Subscribe to push notifications
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        // You would need to generate your own VAPID key
                        'YOUR_PUBLIC_VAPID_KEY_HERE'
                    )
                });

                console.log('✅ Push subscription created:', subscription);

                // Send subscription to your server
                await fetch('/api/save-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                });
            }

            return subscription;
        } catch (error) {
            console.error('❌ Failed to subscribe to push:', error);
            return null;
        }
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Expose functions globally
    window.PWA = {
        requestNotificationPermission,
        subscribeToPushNotifications,
        showLocalNotification: (title, options) => {
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 192 192\'%3E%3Crect fill=\'%23fbbf24\' width=\'192\' height=\'192\' rx=\'24\'/%3E%3Ctext x=\'96\' y=\'135\' font-size=\'110\' text-anchor=\'middle\' font-family=\'Arial, sans-serif\'%3E📚%3C/text%3E%3C/svg%3E',
                    ...options
                });
            }
        }
    };

    // ========================================
    // OFFLINE DETECTION
    // ========================================
    function updateOnlineStatus() {
        const statusElement = document.getElementById('pwa-status');
        if (statusElement) {
            if (navigator.onLine) {
                statusElement.textContent = '';
                statusElement.className = '';
            } else {
                statusElement.textContent = '⚠️ Offline Mode - Changes will sync when online';
                statusElement.className = 'offline-banner';
            }
        }
    }

    window.addEventListener('online', () => {
        updateOnlineStatus();
        console.log('✅ Back online');

        // Trigger background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('sync-completions');
            });
        }
    });

    window.addEventListener('offline', () => {
        updateOnlineStatus();
        console.log('⚠️ Gone offline');
    });

    // Initial status check
    updateOnlineStatus();

    // ========================================
    // MOBILE SPECIFIC OPTIMIZATIONS
    // ========================================

    // Prevent pull-to-refresh on mobile (iOS Safari)
    let lastTouchY = 0;
    let preventPullToRefresh = false;

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        preventPullToRefresh = window.pageYOffset === 0;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;

        if (preventPullToRefresh && touchYDelta > 0) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle viewport changes (useful for iOS Safari address bar)
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    console.log('✅ PWA Setup Complete');
})();
