<?php
session_start();

if (!isset($_SESSION["user"])) {
    // If the user is not logged in, redirect to the login page
    header("Location: index.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "mydatabase");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get a random post
$result = $conn->query("SELECT p.content, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY RAND() LIMIT 1");

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<h2>Random Post:</h2>";
    echo "<p><strong>From:</strong> " . htmlspecialchars($row['username']) . "</p>";
    echo "<p>" . htmlspecialchars($row['content']) . "</p>";
} else {
    echo "No posts found.";
}

$conn->close();
?>
