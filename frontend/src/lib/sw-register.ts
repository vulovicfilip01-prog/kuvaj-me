// Service Worker Registration Utility
// Client-side code to register and manage the service worker

export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return null;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('✅ Service Worker registered successfully:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker installed, prompt user to refresh
            console.log('🔄 New version available! Refresh to update.');
            
            // You can show a notification to the user here
            if (confirm('Nova verzija aplikacije je dostupna. Osvežiti?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker updated, reloading page...');
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return null;
  }
}

// Unregister service worker (for debugging)
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log('🗑️ Service Worker unregistered');
    }
  }
}

// Check if app is running as PWA
export function isPWA() {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// Check online status
export function getOnlineStatus() {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}
