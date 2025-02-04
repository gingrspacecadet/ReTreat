<?php
session_start();

if (!isset($_SESSION["user"])) {
    // If the user is not logged in, redirect to the login page
    header("Location: index.php");
    exit();
}

$user = $_SESSION["user"];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post a Message</title>
</head>
<body>
    <h2>Post a Message</h2>
    <form action="save_message.php" method="post">
        <textarea name="content" rows="5" cols="40" placeholder="Enter your message here..." required></textarea><br>
        <button type="submit">Post Message</button>
    </form>
</body>
</html>
