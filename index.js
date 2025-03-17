document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://login.retreat.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok && data.success) {
    // Store the username in a cookie for 12 hours
    document.cookie = `username=${encodeURIComponent(username)}; path=/; max-age=${12 * 60 * 60}; Secure; SameSite=Lax`;

    // Redirect to home.html
    window.location.href = "https://retreat-4vv.pages.dev/home.html";
  } else {
    // Handle errors if login fails
    document.getElementById('status').textContent = 'Error: ' + (data.error || data.message);
  }
});