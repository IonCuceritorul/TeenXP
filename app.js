document.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
    apiKey: "AIzaSyALiRJPLBGmPSwfJ0oEhzt30KmYol9Fn6A",
    authDomain: "teenxp-dc30f.firebaseapp.com",
    databaseURL: "https://teenxp-dc30f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "teenxp-dc30f",
    storageBucket: "teenxp-dc30f.firebasestorage.app",
    messagingSenderId: "148552569998",
    appId: "1:148552569998:web:81f1bac595865ece40e5df"
  };

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.database();

  const welcome = document.getElementById("welcome");
  const logout = document.getElementById("logout");
  const postJobBtn = document.getElementById("postJobBtn");

  const jobTitle = document.getElementById("jobTitle");
  const jobDescription = document.getElementById("jobDescription");
  const jobReward = document.getElementById("jobReward");
  const jobsDiv = document.getElementById("jobs");

  // Redirect if not logged in
  auth.onAuthStateChanged(user => {
    if (!user) return window.location.href = "login.html";

    db.ref("users/" + user.uid).once("value").then(snap => {
      if (!snap.exists()) {
        welcome.innerText = "Welcome!";
      } else {
        welcome.innerText = "Welcome, " + snap.val().username;
      }
    });
  });

  // Logout
  logout.onclick = () => auth.signOut().then(() => window.location.href = "login.html");

  // Post Job with validation
  postJobBtn.onclick = () => {
    const title = jobTitle.value.trim();
    const desc = jobDescription.value.trim();
    const reward = jobReward.value.trim();

    if (!title || !desc || !reward) {
      alert("Please fill in all fields");
      return;
    }

    const user = auth.currentUser;
    db.ref("users/" + user.uid).once("value").then(snap => {
      const username = snap.val().username || "Anonymous";
      db.ref("jobs").push({
        title,
        description: desc,
        reward,
        postedBy: user.uid,
        posterUsername: username,
        takenBy: null,
        createdAt: Date.now()
      });
    });

    // Clear inputs
    jobTitle.value = "";
    jobDescription.value = "";
    jobReward.value = "";
  };

  // Load Jobs
  db.ref("jobs").on("value", snap => {
    jobsDiv.innerHTML = "";

    if (!snap.exists()) {
      jobsDiv.innerHTML = "<p class='muted'>No jobs available.</p>";
      return;
    }

    snap.forEach(jobSnap => {
      const job = jobSnap.val();
      const div = document.createElement("div");
      div.className = "job";

      div.innerHTML = `
        <strong>${job.title}</strong><br>
        ${job.description}<br>
        Reward: ${job.reward}<br>
        Posted by: ${job.posterUsername}<br>
      `;

      if (!job.takenBy && job.postedBy !== auth.currentUser.uid) {
        const btn = document.createElement("button");
        btn.innerText = "Accept Job";
        btn.onclick = () => {
          db.ref("jobs/" + jobSnap.key).update({ takenBy: auth.currentUser.uid });
        };
        div.appendChild(btn);
      }

      jobsDiv.appendChild(div);
    });
  });

});
