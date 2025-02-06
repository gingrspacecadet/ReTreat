<?php
session_start();
header('Content-Type: application/json'); // Ensure JSON response
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Get the current time in GMT
$time = gmdate("Y-m-d H:i:s"); // GMT/UTC time

// Insert the post with time
$stmt = $conn->prepare("INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user_id, $content, $time);
$stmt->execute();
$stmt->close();

$conn->close();

// Return success as JSON with the time in GMT
echo json_encode(["success" => "Your post has been successfully submitted!", "content" => $content, "user" => $user, "time" => $time]);
?>
