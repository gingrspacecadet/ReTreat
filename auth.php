<?php
session_start();
$conn = new mysqli("localhost", "root", "", "mydatabase");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = $_POST["username"];
$password = $_POST["password"];

// Check if the user exists
$stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // User exists, verify password
    $stmt->bind_result($id, $hashed_password);
    $stmt->fetch();
    
    // Verify the entered password with the hashed one
    if (password_verify($password, $hashed_password)) {
        // Correct password → Login successful
        $_SESSION["user"] = $username;
        header("Location: home.php"); // Redirect after login
        exit();
    } else {
        // Incorrect password
        echo "Incorrect password.";
    }
} else {
    // User doesn't exist, create an account
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed_password);
    
    if ($stmt->execute()) {
        $_SESSION["user"] = $username;
        header("Location: home.php"); // Redirect after signup
        exit();
    } else {
        echo "Error registering user.";
    }
}
$stmt->close();
$conn->close();
?>