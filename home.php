<?php
session_start();

if (!isset($_SESSION["user"])) {
    header("Location: index.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "mydatabase");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retreat - Home</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #c1c1c1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            width: 80vw; /* Set width to 80% of the viewport width */
            height: 80vh; /* Set height to 80% of the viewport height */
            display: flex;
            flex-direction: column;
            max-width: 1200px; /* Optional: Prevents the container from getting too wide */
            min-width: 400px; /* Optional: Prevents it from being too narrow */
        }
        
        .post-box {
            width: 97%; /* Set to 90% of the container width */
            padding: 1vw; /* Padding proportional to viewport width */
            background: white;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        
        textarea {
            width: 97%; /* Takes up full width of the container */
            height: 10vh; /* Height based on viewport height */
            padding: 1vw; /* Padding proportional to viewport width */
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
        }
        
        button {
			margin-top: 1vh; /* Vertical margin relative to viewport height */
            padding: 1vw 2vw;
            border: none;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            border-radius: 5px;
        }
        
        .posts-container {
            flex-grow: 1; /* Takes up remaining space */
            overflow-y: auto; /* Keep scrolling functionality */
            background: white;
            padding: 2vh 2vw; /* Padding relative to viewport size */
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin-top: 2vh; /* Margin relative to viewport height */
        }
        
        /* Hide scrollbar for Webkit browsers (Chrome, Safari) */
        .posts-container::-webkit-scrollbar {
            display: none; /* Hide scrollbar */
        }
        
        .posts-container {
            scrollbar-width: none; /* For Firefox */
            -ms-overflow-style: none; /* For Internet Explorer 10+ */
        }
        
        .post {
            padding: 2vh; /* Padding based on viewport height */
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
            margin-top: 2vh; /* Vertical margin */
            font-size: 1.4vh;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="post-box">
        <textarea id="postContent" placeholder="What's on your mind?"></textarea><br>
        <button onclick="submitPost()">Post</button>
    </div>

    <div id="message"></div>

    <h1 style="color:#2e2e2e">Posts</h1>
    <div class="posts-container" id="posts"></div>
    <p id="loading">Loading more posts...</p>
</div>

<script>
let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;

function loadPosts() {
    if (loading || allPostsLoaded) return;
    loading = true;
    $("#loading").show();

    $.get("load_posts.php", { offset: offset, limit: limit }, function(response) {
        let data = JSON.parse(response);
        
        if (data.length === 0) {
            allPostsLoaded = true;
            $("#loading").text("No more posts.");
            return;
        }

        data.forEach(post => {
            let newPost = `<div class='post'><p><strong>${post.username}:</strong></p><p>${post.content}</p></div>`;
            $("#posts").append(newPost);
        });

        offset += limit;
    }).fail(function() {
        $("#loading").text("Error loading posts.");
    }).always(function() {
        loading = false;
        $("#loading").hide();
    });
}

// Load initial posts
$(document).ready(function() {
    loadPosts();

    $(".posts-container").scroll(function() {
        let container = $(".posts-container")[0];
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
            loadPosts();
        }
    });
});

function submitPost() {
    let content = $("#postContent").val().trim();
    if (content === "") {
        $("#message").text("Post cannot be empty!").css("color", "red");
        return;
    }

    $.post("save_message.php", { content: content }, function(response) {
        let data = JSON.parse(response);
        if (data.error) {
            $("#message").text(data.error).css("color", "red");
        } else {
            $("#message").text(data.success).css("color", "green");

            let newPost = `<div class='post'><p><strong>${data.user}:</strong></p><p>${data.content}</p></div>`;
            $("#posts").prepend(newPost);
        }
    }).fail(function() {
        $("#message").text("Failed to post message.").css("color", "red");
    });

    $("#postContent").val("");
}
</script>

</body>
</html>
