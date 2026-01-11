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

/* LOGIN PAGE */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = () => {
    auth.signInWithEmailAndPassword(
      email.value,
      password.value
    )
    .then(() => window.location.href = "index.html")
    .catch(e => msg.innerText = e.message);
  };
}

/* REGISTER PAGE */
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.onclick = () => {
    if (!username.value || !email.value || !password.value) {
      msg.innerText = "Fill all fields";
      return;
    }

    auth.createUserWithEmailAndPassword(email.value, password.value)
      .then(cred => {
        db.ref("users/" + cred.user.uid).set({
          username: username.value,
          email: email.value
        });
        window.location.href = "login.html";
      })
      .catch(e => msg.innerText = e.message);
  };
}
