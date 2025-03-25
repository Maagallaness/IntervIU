// Firebase Authentication with FirebaseUI and Email/Password

document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBZH3p4yjo8yKE9k7PeWeDBYsM5l_X3lL8",
    authDomain: "intervu-app-7f3b2.firebaseapp.com",
    projectId: "intervu-app-7f3b2",
    storageBucket: "intervu-app-7f3b2.appspot.com",
    messagingSenderId: "654321098765",
    appId: "1:654321098765:web:abcdef123456789"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get DOM elements
  const emailLoginForm = document.getElementById('email-login-form');
  const emailRegisterForm = document.getElementById('email-register-form');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  const guestLoginBtn = document.getElementById('guest-login-btn');
  const loginForm = document.querySelector('.auth-form');
  const registerForm = document.getElementById('register-form');
  
  // Show/hide forms
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }
  
  // Email/Password Login
  if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Clear previous error messages
      clearErrorMessages();
      
      // Sign in with email and password
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log('User signed in successfully:', user);
          
          // Store authentication state
          localStorage.setItem('isAuthenticated', 'true');
          
          // Redirect to index.html
          window.location.href = 'index.html';
        })
        .catch((error) => {
          // Handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Login error:', errorCode, errorMessage);
          
          // Display error message
          const errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          
          // Translate error messages
          let translatedError = '';
          if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
            translatedError = window.i18n.t('auth.invalidCredentials');
          } else if (errorCode === 'auth/invalid-email') {
            translatedError = window.i18n.t('auth.invalidEmail');
          } else if (errorCode === 'auth/too-many-requests') {
            translatedError = window.i18n.t('auth.tooManyRequests');
          } else {
            translatedError = window.i18n.t('auth.loginError');
          }
          
          errorElement.textContent = translatedError;
          emailLoginForm.appendChild(errorElement);
        });
    });
  }
  
  // Email/Password Registration
  if (emailRegisterForm) {
    emailRegisterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Clear previous error messages
      clearErrorMessages();
      
      // Validate passwords match
      if (password !== confirmPassword) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = window.i18n.t('auth.passwordMismatch');
        emailRegisterForm.appendChild(errorElement);
        return;
      }
      
      // Create user with email and password
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log('User registered successfully:', user);
          
          // Send email verification
          user.sendEmailVerification().then(() => {
            console.log('Verification email sent');
            
            // Show success message
            const successElement = document.createElement('div');
            successElement.className = 'success-message';
            successElement.textContent = window.i18n.t('auth.verificationEmailSent');
            emailRegisterForm.appendChild(successElement);
            
            // Clear form
            emailRegisterForm.reset();
            
            // Switch back to login form after 3 seconds
            setTimeout(() => {
              registerForm.style.display = 'none';
              loginForm.style.display = 'block';
            }, 3000);
          });
        })
        .catch((error) => {
          // Handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Registration error:', errorCode, errorMessage);
          
          // Display error message
          const errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          
          // Translate error messages
          let translatedError = '';
          if (errorCode === 'auth/email-already-in-use') {
            translatedError = window.i18n.t('auth.emailInUse');
          } else if (errorCode === 'auth/invalid-email') {
            translatedError = window.i18n.t('auth.invalidEmail');
          } else if (errorCode === 'auth/weak-password') {
            translatedError = window.i18n.t('auth.weakPassword');
          } else {
            translatedError = window.i18n.t('auth.registrationError');
          }
          
          errorElement.textContent = translatedError;
          emailRegisterForm.appendChild(errorElement);
        });
    });
  }
  
  // Forgot Password
  const forgotPasswordLink = document.getElementById('forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      
      if (!email) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = window.i18n.t('auth.enterEmail');
        emailLoginForm.appendChild(errorElement);
        return;
      }
      
      // Send password reset email
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          // Password reset email sent
          const successElement = document.createElement('div');
          successElement.className = 'success-message';
          successElement.textContent = window.i18n.t('auth.resetEmailSent');
          emailLoginForm.appendChild(successElement);
        })
        .catch((error) => {
          // Handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Password reset error:', errorCode, errorMessage);
          
          // Display error message
          const errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          
          // Translate error messages
          let translatedError = '';
          if (errorCode === 'auth/invalid-email') {
            translatedError = window.i18n.t('auth.invalidEmail');
          } else if (errorCode === 'auth/user-not-found') {
            translatedError = window.i18n.t('auth.userNotFound');
          } else {
            translatedError = window.i18n.t('auth.resetError');
          }
          
          errorElement.textContent = translatedError;
          emailLoginForm.appendChild(errorElement);
        });
    });
  }
  
  // Guest Login
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', function() {
      // Sign in anonymously
      firebase.auth().signInAnonymously()
        .then(() => {
          // Signed in as guest
          console.log('Signed in as guest');
          
          // Store authentication state
          localStorage.setItem('isAuthenticated', 'true');
          
          // Redirect to index.html
          window.location.href = 'index.html';
        })
        .catch((error) => {
          // Handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Guest login error:', errorCode, errorMessage);
        });
    });
  }
  
  // Helper function to clear error messages
  function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message, .success-message');
    errorMessages.forEach(message => message.remove());
  }
  
  // Initialize the FirebaseUI Widget using Firebase (as fallback)
  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  // FirebaseUI configuration
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        console.log('User signed in successfully:', authResult.user);
        
        // Store authentication state in localStorage to maintain session
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to index.html
        window.location.href = 'index.html';
        
        // Return false to avoid automatic redirect (we handle it manually)
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html', // Fallback URL if manual redirect fails
    signInOptions: [
      // Enable the email provider
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // Enable the anonymous provider
      {
        provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
        buttonText: 'Continuar como invitado'
      }
    ],
    // Terms of service url.
    tosUrl: '#',
    // Privacy policy url.
    privacyPolicyUrl: '#'
  };

  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

// Function to check if user is signed in
function checkAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user);
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      
      // If we're on the login page, redirect to index
      if (window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
      }
    } else {
      // No user is signed in
      console.log("No user is signed in");
      localStorage.removeItem('isAuthenticated');
      
      // If we're not on the login page and not coming from login, redirect to login
      const isLoginPage = window.location.pathname.includes('login.html');
      if (!isLoginPage && !document.referrer.includes('login.html')) {
        // Check if this is a direct access to index.html
        const isDirectAccess = !document.referrer || document.referrer.includes('index.html');
        if (isDirectAccess) {
          window.location.href = 'login.html';
        }
      }
    }
  });
}

// Check auth state when the script loads
checkAuthState();