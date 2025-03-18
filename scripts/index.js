const baseDomain = window.location.hostname.includes("canary-ec4") 
  ? "canary" 
  : "";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://${baseDomain}login.retreat.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      document.cookie = `username=${encodeURIComponent(username)}; path=/; max-age=${12 * 60 * 60}; Secure; SameSite=Lax`;
      window.location.href = "/home.html";
    } else {
      document.getElementById('status').textContent = 'Error: ' + (data.error || data.message);
    }
  });
});
