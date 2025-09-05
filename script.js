const API_BASE = "https://43bcb81d-d722-4566-b721-f9642a13e838-00-1lhszcmtdwdh1.kirk.replit.dev";

const authUI = document.getElementById("authUI");
const gameUI = document.getElementById("gameUI");
const logoutBtn = document.getElementById("logoutBtn");
const earnBtn = document.getElementById("earnBtn");
const localCoinsEl = document.getElementById("localCoins");
const totalCoinsEl = document.getElementById("totalCoins");
const leaderboardList = document.getElementById("leaderboardList");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

let currentUser = null;
let sessionScore = 0;

function updateCounters() {
  localCoinsEl.textContent = "💰 PC Simulator Coins: " + sessionScore;
  totalCoinsEl.textContent = "Your Total Score: " + (currentUser?.totalScore || 0);
}

async function loadLeaderboard() {
  const res = await fetch(API_BASE + "/leaderboard");
  const users = await res.json();
  leaderboardList.innerHTML = "";
  users.forEach((u, i) => {
    const li = document.createElement("li");
    if (i === 0) li.classList.add("rank-1");
    else if (i === 1) li.classList.add("rank-2");
    else if (i === 2) li.classList.add("rank-3");
    li.textContent = `${u.nickname}: ${u.totalScore}`;
    leaderboardList.appendChild(li);
  });
}

earnBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  const res = await fetch(API_BASE + "/earn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentUser)
  });
  const data = await res.json();
  if (data.success) {
    sessionScore += 5;
    currentUser.totalScore = data.totalScore;
    updateCounters();
    loadLeaderboard();
  } else alert(data.error);
});

showLogin.onclick = () => {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
};
showRegister.onclick = () => {
  registerForm.style.display = "block";
  loginForm.style.display = "none";
};

registerBtn.onclick = async () => {
  const name = document.getElementById("regName").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const res = await fetch(API_BASE + "/register", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname: name, password: pass })
  });
  const data = await res.json();
  if (data.success) {
    currentUser = data.user;
    localStorage.setItem("user", JSON.stringify(data.user));
    authUI.style.display = "none"; gameUI.style.display = "block"; logoutBtn.style.display = "block";
    updateCounters(); loadLeaderboard();
  } else alert(data.error);
};

loginBtn.onclick = async () => {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const res = await fetch(API_BASE + "/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname: name, password: pass })
  });
  const data = await res.json();
  if (data.success) {
    currentUser = data.user;
    localStorage.setItem("user", JSON.stringify(data.user));
    authUI.style.display = "none"; gameUI.style.display = "block"; logoutBtn.style.display = "block";
    updateCounters(); loadLeaderboard();
  } else alert(data.error);
};

logoutBtn.onclick = () => {
  localStorage.removeItem("user");
  currentUser = null;
  sessionScore = 0;
  authUI.style.display = "block"; gameUI.style.display = "none"; logoutBtn.style.display = "none";
};

window.addEventListener("load", async () => {
  const saved = localStorage.getItem("user");
  if (saved) {
    currentUser = JSON.parse(saved);
    authUI.style.display = "none"; gameUI.style.display = "block"; logoutBtn.style.display = "block";
    updateCounters(); loadLeaderboard();
  } else {
    loadLeaderboard();
  }
});
