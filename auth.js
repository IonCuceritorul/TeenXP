const firebaseConfig = {
  apiKey: "AIzaSyALiRJPLBGmPSwfJ0oEhzt30KmYol9Fn6A",
  authDomain: "teenxp-dc30f.firebaseapp.com",
  databaseURL: "https://teenxp-dc30f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teenxp-dc30f",
  storageBucket: "teenxp-dc30f.firebasestorage.app",
  messagingSenderId: "148552569998",
  appId: "1:148552569998:web:81f1bac595865ece40e5df"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const msg = document.getElementById("message");

// Inputs (SAFE, EXPLICIT)
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");

// LOGIN PAGE
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = () => {
    auth
      .signInWithEmailAndPassword(
        emailInput.value,
        passwordInput.value
      )
      .then(() => window.location.href = "index.html")
      .catch(err => msg.innerText = err.message);
  };
}

// REGISTER PAGE
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.onclick = () => {
    if (!usernameInput.value || !emailInput.value || !passwordInput.value) {
      msg.innerText = "Fill all fields";
      return;
    }

    auth
      .createUserWithEmailAndPassword(
        emailInput.value,
        passwordInput.value
      )
      .then(cred => {
        return db.ref("users/" + cred.user.uid).set({
          username: usernameInput.value,
          email: emailInput.value
        });
      })
      .then(() => window.location.href = "login.html")
      .catch(err => msg.innerText = err.message);
  };
}
