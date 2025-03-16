<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReTreat - Home</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        /* Apply dark mode instantly to prevent flashing white screen */
        <script>
            if (localStorage.getItem("dark-mode") === "true") {
                document.documentElement.classList.add("dark-mode");
            }
        </script>

        /* Disable transitions during initial load */
        html.dark-mode * {
            transition: none !important;
        }

        /* Light Mode Styles */
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s, color 0.3s;
        }

        body {
            background-color: #f4f4f4; /* Light mode default background */
            color: #2e2e2e; /* Default text color */
        }

        .container {
            width: 80vw;
            height: 80vh;
            display: flex;
            flex-direction: column;
            max-width: 1200px;
            min-width: 400px;
            background-color: #f4f4f4; /* Light mode default container background */
            transition: background-color 0.3s;
        }

        .post-box {
            text-align: right;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
        }

        body:not(.dark-mode) .container {
            background-color: #f4f4f4;
        }

        body:not(.dark-mode) .post-box,
        body:not(.dark-mode) .posts-container,
        body:not(.dark-mode) textarea {
            background-color: #f4f4f4;
            color: black;
            border-color: #ccc;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        .textarea {
            margin-top: 4px;
            margin-left: 4px;
            margin-right: 4px;
            text-align: center;
            resize: none;
        }

        textarea {
            width: 96.6%;
            height: 10vh;
            padding: 1vw;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
        }

        button {
            margin-right: 4px;
            margin-bottom: 4px;
            padding: 1vw 2vw;
            border: none;
            color: #f4f4f4;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
        }

        .posts-container {
            flex-grow: 1;
            overflow-y: auto;
            padding: 2vh 2vw;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin-top: 2vh;
            transition: background-color 0.3s;
        }

        .posts-container::-webkit-scrollbar {
            display: none;
        }

        .posts-container {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .post {
            padding: 2vh;
            border-bottom: 1px solid #ddd;
        }

        .post:last-child {
            border-bottom: none;
        }

        #loading {
            display: none;
            font-size: 1.4vh;
            color: gray;
        }

        #message {
            color: green;
            margin-top: 2vh;
            font-size: 1.4vh;
            font-weight: bold;
        }

        /* Dark Mode Styles */
        body.dark-mode {
            background-color: #181818;
            color: #f4f4f4;
            transition: background-color 0.3s, color 0.3s;
        }

        body.dark-mode .container {
            background-color: #181818;
        }

        body.dark-mode .post-box,
        body.dark-mode .posts-container,
        body.dark-mode textarea {
            background-color: #181818;
            color: #f4f4f4;
            border-color: #555;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        body.dark-mode button {
            background-color: #333;
            color: #f4f4f4;
            border: none;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        body.dark-mode h1 {
            color: #f4f4f4;
            transition: color 0.3s;
        }

        /* Mode toggle button */
        #mode-toggle {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 1000;
            transition: background-color 0.3s, color 0.3s;
        }

        #logout {
            position: absolute;
            bottom: 10px;
            left: 10px;
        }

        #settings {
            position: absolute;
            top: 10px;
            right: 10px;
        }

        /* Default h1 style for light mode */
        h1 {
            color: #2e2e2e;
            transition: color 0.3s;
        }
    </style>    
</head>

<body>

<button id="settings" onclick="settings()">Settings</button>
<button id="logout" onclick="logout()">Logout</button>
<button id="mode-toggle" onclick="toggleMode()"><img src="http://localhost/retreat/assets/moon.png" width="40" height="40"></button>

<div class="container">
    <div class="post-box">
        <div class="textarea">
            <textarea id="postContent" placeholder="What's on your mind?"></textarea><br>
        </div>
        <button onclick="submitPost()">Post</button>
    </div>

    <div id="message"></div>

    <h1>Posts</h1>
    <div class="posts-container" id="posts"></div>
    <p id="loading">Loading more posts...</p>
</div>

<script>
let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;

// Function to get the cookie value by name
function getCookie(name) {
    let cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Retrieve accent color from cookie (instead of localStorage)
const accentColor = getCookie("accentcolour") ? `#${getCookie("accentcolour")}` : "#007bff"; // Default color

// Set accent color for all buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("button").forEach(button => {
        button.style.backgroundColor = accentColor;
    });
});


function settings() {
    window.location.href = 'settings.html';
}

function logout() {
    window.location.href = 'logout.php';
}

function loadPosts() {
    if (loading || allPostsLoaded) return;
    loading = true;
    document.getElementById("loading").style.display = "block";

    // Simulating an API request for posts (replace with actual AJAX request)
    setTimeout(() => {
        const posts = []; // Mocked posts data
        if (posts.length === 0) {
            allPostsLoaded = true;
            document.getElementById("loading").innerText = "No more posts.";
            return;
        }

        posts.forEach(post => {
            let formattedContent = post.content.replace(/\n/g, "<br>");
            let newPost = `<div class='post'><p><strong>${post.username}:</strong></p><p>${formattedContent}</p></div>`;
            document.getElementById("posts").innerHTML += newPost;
        });

        offset += limit;
        loading = false;
        document.getElementById("loading").style.display = "none";
    }, 1000);
}

function submitPost() {
    let content = document.getElementById("postContent").value.trim();
    if (content === "") {
        document.getElementById("message").innerText = "Post cannot be empty!";
        document.getElementById("message").style.color = "red";
        return;
    }

    // Simulate submitting post (replace with AJAX request)
    setTimeout(() => {
        document.getElementById("message").innerText = "Post successful!";
        document.getElementById("message").style.color = "green";

        let newPost = `<div class='post'><p><strong>User:</strong></p><p>${content}</p></div>`;
        document.getElementById("posts").insertAdjacentHTML('afterbegin', newPost);

        loadPosts();
    }, 1000);

    document.getElementById("postContent").value = "";
}

function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const modeButton = document.getElementById("mode-toggle");

    // Check the current mode and update button icon
    if (document.body.classList.contains("dark-mode")) {
        modeButton.innerHTML = '<img src="http://localhost/retreat/assets/sun.png" width="40" height="40">';
        localStorage.setItem("dark-mode", "true");
    } else {
        modeButton.innerHTML = '<img src="http://localhost/retreat/assets/moon.png" width="40" height="40">';
        localStorage.setItem("dark-mode", "false");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("mode-toggle").innerHTML = '<img src="http://localhost/retreat/assets/sun.png" width="40" height="40">';
    } else {
        document.getElementById("mode-toggle").innerHTML = '<img src="http://localhost/retreat/assets/moon.png" width="40" height="40">';
    }
});
</script>

</body>
</html>