// Translations for IntervIU application

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.login": "Login",
    "nav.contact": "Contact",
    
    // Hero section
    "hero.title": "Technical interviews without complications",
    "hero.subtitle": "IntervIU automatically connects recruiters with expert interviewers.",
    "hero.cta.start": "Start now",
    "hero.cta.learnMore": "Learn more",
    
    // Features section
    "features.connect.title": "Connect with experts",
    "features.connect.description": "Access a network of technical interviewers specialized in different technologies.",
    "features.time.title": "Save time",
    "features.time.description": "Automate the selection process and reduce hiring time.",
    "features.quality.title": "Improve quality",
    "features.quality.description": "Get precise and detailed technical evaluations of candidates.",
    
    // Footer
    "footer.terms": "Terms and conditions",
    "footer.privacy": "Privacy policy",
    "footer.contact": "Contact",
    "footer.copyright": "© 2023 IntervIU. All rights reserved.",
    
    // Authentication
    "auth.login": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot password?",
    "auth.signIn": "Sign in",
    "auth.register": "Register",
    "auth.noAccount": "Don't have an account?",
    "auth.createAccount": "Create account",
    "auth.haveAccount": "Already have an account?",
    "auth.guest": "Continue as guest",
    "auth.loading": "Loading...",
    "auth.or": "or",
    "auth.confirmPassword": "Confirm password",
    "auth.invalidCredentials": "Invalid email or password",
    "auth.invalidEmail": "Invalid email format",
    "auth.tooManyRequests": "Too many failed login attempts. Please try again later.",
    "auth.loginError": "Error during login. Please try again.",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.emailInUse": "Email is already in use",
    "auth.weakPassword": "Password is too weak",
    "auth.registrationError": "Error during registration. Please try again.",
    "auth.enterEmail": "Please enter your email address",
    "auth.resetEmailSent": "Password reset email sent",
    "auth.userNotFound": "No user found with this email address",
    "auth.resetError": "Error sending password reset email",
    "auth.verificationEmailSent": "Verification email sent. Please check your inbox."
  },
  es: {
    // Navegación
    "nav.home": "Inicio",
    "nav.login": "Iniciar sesión",
    "nav.contact": "Contacto",
    
    // Sección hero
    "hero.title": "Entrevistas técnicas sin complicaciones",
    "hero.subtitle": "IntervIU conecta a los reclutadores con entrevistadores expertos de manera automática.",
    "hero.cta.start": "Comenzar ahora",
    "hero.cta.learnMore": "Saber más",
    
    // Sección de características
    "features.connect.title": "Conecta con expertos",
    "features.connect.description": "Accede a una red de entrevistadores técnicos especializados en diferentes tecnologías.",
    "features.time.title": "Ahorra tiempo",
    "features.time.description": "Automatiza el proceso de selección y reduce el tiempo de contratación.",
    "features.quality.title": "Mejora la calidad",
    "features.quality.description": "Obtén evaluaciones técnicas precisas y detalladas de los candidatos.",
    
    // Pie de página
    "footer.terms": "Términos y condiciones",
    "footer.privacy": "Política de privacidad",
    "footer.contact": "Contacto",
    "footer.copyright": "© 2023 IntervIU. Todos los derechos reservados.",
    
    // Autenticación
    "auth.login": "Iniciar Sesión",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.signIn": "Iniciar sesión",
    "auth.register": "Registrarse",
    "auth.noAccount": "¿No tienes una cuenta?",
    "auth.createAccount": "Crear cuenta",
    "auth.haveAccount": "¿Ya tienes una cuenta?",
    "auth.guest": "Continuar como invitado",
    "auth.loading": "Cargando...",
    "auth.or": "o",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.invalidCredentials": "Correo electrónico o contraseña inválidos",
    "auth.invalidEmail": "Formato de correo electrónico inválido",
    "auth.tooManyRequests": "Demasiados intentos fallidos. Por favor, inténtalo más tarde.",
    "auth.loginError": "Error durante el inicio de sesión. Por favor, inténtalo de nuevo.",
    "auth.passwordMismatch": "Las contraseñas no coinciden",
    "auth.emailInUse": "El correo electrónico ya está en uso",
    "auth.weakPassword": "La contraseña es demasiado débil",
    "auth.registrationError": "Error durante el registro. Por favor, inténtalo de nuevo.",
    "auth.enterEmail": "Por favor, introduce tu correo electrónico",
    "auth.resetEmailSent": "Correo de restablecimiento de contraseña enviado",
    "auth.userNotFound": "No se encontró ningún usuario con este correo electrónico",
    "auth.resetError": "Error al enviar el correo de restablecimiento de contraseña",
    "auth.verificationEmailSent": "Correo de verificación enviado. Por favor, revisa tu bandeja de entrada."
  }
};

// Default language
let currentLanguage = 'es';

// Function to get the translation for a key
function t(key) {
  const lang = translations[currentLanguage];
  return lang[key] || key; // Return the key itself if translation not found
}

// Function to change the language
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    // Save language preference to localStorage
    localStorage.setItem('language', lang);
    // Update all translatable elements on the page
    updatePageTranslations();
    return true;
  }
  return false;
}

// Function to initialize language from localStorage or browser settings
function initLanguage() {
  // Check if language is stored in localStorage
  const storedLang = localStorage.getItem('language');
  if (storedLang && translations[storedLang]) {
    currentLanguage = storedLang;
  } else {
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      currentLanguage = browserLang;
    }
  }
  
  // Update UI to reflect current language
  updateLanguageSelector();
  // Translate the page
  updatePageTranslations();
}

// Function to update the language selector UI
function updateLanguageSelector() {
  const languageLinks = document.querySelectorAll('.language-selector a');
  languageLinks.forEach(link => {
    const lang = link.getAttribute('data-lang');
    if (lang === currentLanguage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Function to update all translatable elements on the page
function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = t(key);
    }
  });
  
  // Update attributes that need translation (like placeholders)
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const data = element.getAttribute('data-i18n-attr').split(',');
    data.forEach(item => {
      const [attr, key] = item.split(':');
      if (attr && key) {
        element.setAttribute(attr, t(key));
      }
    });
  });
}

// Export the translation functions
window.i18n = {
  t,
  setLanguage,
  initLanguage,
  getCurrentLanguage: () => currentLanguage
};

// Initialize language when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initLanguage();
});