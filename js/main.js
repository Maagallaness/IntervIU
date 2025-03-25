// Main JavaScript file for IntervU landing page

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const homeLink = document.getElementById('home-link');
    const loginLink = document.getElementById('login-link');
    
    if (isAuthenticated) {
        if (homeLink) homeLink.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
    } else {
        if (homeLink) homeLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
    }
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle functionality can be added here
    
    // Language selector functionality
    const languageLinks = document.querySelectorAll('.language-selector a');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the language code from the data-lang attribute
            const lang = this.getAttribute('data-lang');
            if (!lang) return;
            
            // Set the language using the i18n function
            if (window.i18n && window.i18n.setLanguage) {
                const success = window.i18n.setLanguage(lang);
                
                if (success) {
                    // Remove active class from all language links
                    languageLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    console.log('Language switched to:', lang);
                }