const API_BASE = "https://your-backend-url.com/api"; // replace with real endpoint

// -------- Firebase authentication setup --------
// firebase-config.js is loaded before this script and handles initialization
if (window.firebase) {
  const auth = firebase.auth();
  
  // Function to redirect to login if user is not authenticated
  // Call this on pages that require login
  window.requireLogin = () => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        // User is not logged in, redirect to login page
        window.location = './login.html';
      }
    });
  };
  
  // update the nav login/logout link depending on auth state
  auth.onAuthStateChanged(user => {
    // publish global flag for other scripts
    window.currentUser = user;

    const navLogin = document.getElementById('nav-login');
    if (navLogin) {
      if (user) {
        navLogin.textContent = `Logout`;
        navLogin.href = '#';
        navLogin.onclick = e => {
          e.preventDefault();
          auth.signOut();
        };
      } else {
        navLogin.textContent = 'Login';
        navLogin.href = './login.html';
        navLogin.onclick = null;
      }
    }

    // hide the entire submit-score section unless the user is logged in
    const submitSection = document.getElementById('submit-score');
    if (submitSection) {
      submitSection.style.display = user ? '' : 'none';
    }
  });

async function fetchChallenges() {
  try {
    const res = await fetch(`${API_BASE}/challenges`);
    const challenges = await res.json();
    const list = document.getElementById("challenge-list");
    const select = document.getElementById("challenge");
    if (!list || !select) return;
    challenges.forEach(ch => {
      const li = document.createElement("li");
      li.textContent = ch.name;
      list.appendChild(li);

      const option = document.createElement("option");
      option.value = ch.id;
      option.textContent = ch.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.warn('fetchChallenges error:', err);
  }
}
}

async function submitScore(event) {
  event.preventDefault();
  // require authenticated user
  if (window.firebase && !firebase.auth().currentUser) {
    const msg = document.getElementById("form-message");
    if (msg) msg.textContent = 'Please log in to submit a score.';
    return;
  }
  const username = document.getElementById("username").value;
  const challengeId = document.getElementById("challenge").value;
  const score = parseFloat(document.getElementById("score").value);
  const res = await fetch(`${API_BASE}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, challenge_id: challengeId, score })
  });
  const data = await res.json();
  document.getElementById("form-message").textContent = data.status ? "Score submitted!" : data.error;
  loadLeaderboard(challengeId);
}

async function loadLeaderboard(challengeId) {
  const res = await fetch(`${API_BASE}/leaderboard/${challengeId}`);
  const scores = await res.json();
  const container = document.getElementById("leaderboard-entries");
  if (scores.length === 0) {
    container.textContent = "No scores yet.";
    return;
  }
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = "<th>Rank</th><th>Name</th><th>Score</th>";
  table.appendChild(header);
  scores.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${idx+1}</td><td>${s.username}</td><td>${s.score}</td>`;
    table.appendChild(tr);
  });
  container.innerHTML = "";
  container.appendChild(table);
}

// attach score form handler only if form present
// (other pages don’t include it)
// we'll register this inside DOMContentLoaded below instead of running immediately

window.addEventListener("DOMContentLoaded", async () => {
  // only try to fetch challenges when the list exists (not on login/register page)
  if (document.getElementById("challenge-list")) {
    try {
      await fetchChallenges();
    } catch (err) {
      console.warn('fetchChallenges error:', err);
    }
  }

  // attach form handler if the form exists on this page
  const scoreForm = document.getElementById("score-form");
  if (scoreForm) {
    scoreForm.addEventListener("submit", submitScore);
  }

  // mark current navigation link using file-name logic
  const links = document.querySelectorAll("nav a");
  let currentFile = window.location.pathname.split('/').pop();
  if (!currentFile) currentFile = 'index.html';
  links.forEach(link => {
    let href = link.getAttribute("href");
    console.log(link);
    if (href === './' || href === '') href = 'index.html';
    const linkFile = href.split('/').pop();
    if (linkFile === currentFile) {
        console.log(linkFile);
      link.classList.add("active");
    }
  });
});

// run once at startup
// const links = document.querySelectorAll('header nav a');
// links.forEach(a => {
//   a.addEventListener('click', e => {
//     // if it’s a hash or same‑page link, prevent navigation
//     e.preventDefault();
//     links.forEach(x => x.classList.remove('active'));
//     a.classList.add('active');
//     // optionally change location or show a different section…
//   });
// });