<?php
session_start();

if (!isset($_SESSION["user"])) {
    die(json_encode(["error" => "You must be logged in to post."]));
}

$user = $_SESSION["user"];
$content = trim($_POST["content"]);

if (empty($content)) {
    die(json_encode(["error" => "Post cannot be empty."]));
}

$conn = new mysqli("localhost", "root", "", "mydatabase");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}

// Get the user ID
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$stmt->bind_result($user_id);
$stmt->fetch();
$stmt->close();

// Insert the post
$stmt = $conn->prepare("INSERT INTO posts (user_id, content) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $content);
$stmt->execute();
$stmt->close();

$conn->close();

// Return success as JSON
echo json_encode(["success" => "Your post has been successfully submitted!", "content" => $content, "user" => $user]);
?>
