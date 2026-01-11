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

auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = "login.html";

  db.ref("users/" + user.uid).once("value").then(snap => {
    welcome.innerText = "Welcome, " + snap.val().username;
  });
});

logout.onclick = () => auth.signOut();

addJob.onclick = () => {
  const user = auth.currentUser;

  db.ref("users/" + user.uid).once("value").then(snap => {
    db.ref("jobs").push({
      title: title.value,
      desc: desc.value,
      reward: reward.value,
      postedBy: user.uid,
      posterUsername: snap.val().username,
      takenBy: null
    });
  });
};

db.ref("jobs").on("value", snap => {
  jobs.innerHTML = "";

  if (!snap.exists()) {
    jobs.innerHTML = "<p class='muted'>No jobs available.</p>";
    return;
  }

  snap.forEach(jobSnap => {
    const job = jobSnap.val();
    const div = document.createElement("div");
    div.className = "job";

    div.innerHTML = `
      <strong>${job.title}</strong><br>
      ${job.desc}<br>
      Reward: ${job.reward}<br>
      Posted by: ${job.posterUsername}<br>
    `;

    if (!job.takenBy && job.postedBy !== auth.currentUser.uid) {
      const btn = document.createElement("button");
      btn.innerText = "Accept Job";
      btn.onclick = () =>
        db.ref("jobs/" + jobSnap.key)
          .update({ takenBy: auth.currentUser.uid });
      div.appendChild(btn);
    }

    jobs.appendChild(div);
  });
});
