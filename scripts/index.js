document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://canarylogin.retreat.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      document.cookie = `username=${encodeURIComponent(username)}; path=/; max-age=${12 * 60 * 60}; Secure; SameSite=Lax`;
      window.location.href = "https://canary-ec4.pages.dev/home.html";
    } else {
      document.getElementById('status').textContent = 'Error: ' + (data.error || data.message);
    }
  });
});
