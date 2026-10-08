

const firebaseConfig = {
  apiKey: "AIzaSyAafEN7GjVb19cmGKPZoTVz5vTD_CMico0",
  authDomain: "knot-244e9.firebaseapp.com",
  projectId: "knot-244e9",
  storageBucket: "knot-244e9.firebasestorage.app",
  messagingSenderId: "791319636554",
  appId: "1:791319636554:web:25ea6dd935a014c65dd4b3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('authErrorMessage');

const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const signupFields = document.getElementById('signupFields');

let isLoginMode = true;

tabLogin.addEventListener('click', () => {
    isLoginMode = true;
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    signupFields.style.display = 'none';
    submitBtn.textContent = 'Sign In';
    nameInput.removeAttribute('required');
    hideError();
});

tabSignup.addEventListener('click', () => {
    isLoginMode = false;
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupFields.style.display = 'block';
    submitBtn.textContent = 'Create Account';
    nameInput.setAttribute('required', 'true');
    hideError();
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait...';

    try {
        if (isLoginMode) {
            
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.updateProfile({
                displayName: name
            });
        }

        const token = await auth.currentUser.getIdToken();
        await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error("Auth Error:", error);

        let friendlyMessage = "An error occurred. Please try again.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            friendlyMessage = "Incorrect email or password.";
        } else if (error.code === 'auth/email-already-in-use') {
            friendlyMessage = "An account with this email already exists.";
        } else if (error.code === 'auth/weak-password') {
            friendlyMessage = "Password should be at least 6 characters.";
        }
        
        showError(friendlyMessage);

        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? 'Sign In' : 'Create Account';
    }
});

// We remove the aggressive onAuthStateChanged redirect from here,
// because it interrupts the database sync process when a new user signs up.

