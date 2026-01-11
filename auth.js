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

document.getElementById("registerBtn").onclick = () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    msg.innerText = "Fill all fields";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      db.ref("users/" + cred.user.uid).set({
        username,
        email
      });
      msg.innerText = "Account created. You can login.";
    })
    .catch(e => msg.innerText = e.message);
};

document.getElementById("loginBtn").onclick = () => {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  )
  .then(() => window.location.href = "index.html")
  .catch(e => msg.innerText = e.message);
};
