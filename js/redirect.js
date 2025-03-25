// This script checks if the current page is the root page and redirects to login.html

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the root page (index.html) and not already coming from login
  const currentPath = window.location.pathname;
  const isRootPage = currentPath === '/' || 
                     currentPath === '/index.html' || 
                     currentPath.endsWith('/IntervIU/') || 
                     currentPath.endsWith('/IntervIU/index.html');
  
  // Get the referrer to check if we're coming from the login page
  const referrer = document.referrer;
  const isFromLogin = referrer.includes('login.html');
  
  // If we're on the root page and not coming from login, redirect to login
  if (isRootPage && !isFromLogin) {
    window.location.href = 'login.html';
  }
});