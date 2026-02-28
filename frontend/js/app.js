const API_BASE = "https://your-backend-url.com/api"; // replace with real endpoint

async function fetchChallenges() {
  const res = await fetch(`${API_BASE}/challenges`);
  const challenges = await res.json();
  const list = document.getElementById("challenge-list");
  const select = document.getElementById("challenge");
  challenges.forEach(ch => {
    const li = document.createElement("li");
    li.textContent = ch.name;
    list.appendChild(li);

    const option = document.createElement("option");
    option.value = ch.id;
    option.textContent = ch.name;
    select.appendChild(option);
  });
}

async function submitScore(event) {
  event.preventDefault();
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
  await fetchChallenges();
  // attach form handler if the form exists on this page
  const scoreForm = document.getElementById("score-form");
  if (scoreForm) {
    scoreForm.addEventListener("submit", submitScore);
  }

});

const links = document.querySelectorAll("nav a");
const currentPage = window.location.pathname;

links.forEach(link => {
    if (link.getAttribute("href") === currentPage.split("/").pop()) {
        link.classList.add("active");
    }
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