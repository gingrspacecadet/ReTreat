<?php
session_start();

if (!isset($_SESSION["user"])) {
    // If the user is not logged in, redirect to the login page
    header("Location: index.php");
    exit();
}

$user = $_SESSION["user"];
$content = trim($_POST["content"]);  // Changed to 'content' for posts

// Get the user ID from the database
$conn = new mysqli("localhost", "root", "", "mydatabase");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$stmt->bind_result($user_id);
$stmt->fetch();
$stmt->close();

// Insert the post into the posts table
$stmt = $conn->prepare("INSERT INTO posts (user_id, content) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $content);
$stmt->execute();
$stmt->close();

$conn->close();

echo "Post created successfully!";
?>
