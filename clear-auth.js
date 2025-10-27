// Simple script to clear authentication data from localStorage
// Run this in the browser console if you need to force logout

console.log('🔄 Clearing authentication data...');

// Clear all auth-related localStorage items
localStorage.removeItem('authToken');
localStorage.removeItem('isDemoMode');

console.log('✅ Authentication data cleared.');
console.log('🔄 Reloading page...');

// Reload the page to reset the app state
window.location.href = '/';

// Alternative: Just reload without redirect
// window.location.reload();