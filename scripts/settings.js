// Function to get the cookie value by name
function getCookie(name) {
	let cookieArr = document.cookie.split("; ");
	for (let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");
		if (name == cookiePair[0]) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
	const d = new Date();
	d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
	const expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Retrieve and apply the saved accent color from cookie
const savedAccentColor = getCookie("accentcolour");
if (savedAccentColor) {
	document.documentElement.style.setProperty("--accent-color", savedAccentColor);
	document.getElementById("mode-toggle").style.backgroundColor = `#${savedAccentColor}`;
	document.getElementById("home").style.backgroundColor = `#${savedAccentColor}`;
	document.getElementById("submit").style.backgroundColor = `#${savedAccentColor}`;			// Update Home button
}

// Handle form submission to update the accent color
document.getElementById("colorForm").addEventListener("submit", function(e) {
	e.preventDefault();
	const newColor = document.getElementById("new_value").value;

	// Validate hex color format (6 characters, no #)
	const hexPattern = /^[0-9A-Fa-f]{6}$/;
	if (hexPattern.test(newColor)) {
		setCookie("accentcolour", newColor, 365);  // Save color in cookie for 1 year
		document.documentElement.style.setProperty("--accent-color", newColor);
		document.querySelector("button").style.backgroundColor = `#${newColor}`; // Update the 'Update' button color
		document.getElementById("home").style.backgroundColor = `#${newColor}`;  // Update Home button color
		document.getElementById("message").textContent = "Accent color updated successfully!";
	} else {
		document.getElementById("message").textContent = "Invalid hex code! Must be exactly 6 characters.";
	}
});

// Dark Mode Toggle Logic
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
	document.body.classList.toggle("dark-mode");
	localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
});

// Load saved dark mode preference
if (localStorage.getItem("dark-mode") === "true") {
	document.body.classList.add("dark-mode");
}

function home() {
	window.location.href = 'home.html';
}
