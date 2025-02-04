<?php
session_start();

if (!isset($_SESSION["user"])) {
    // If the user is not logged in, redirect to the login page
    header("Location: index.php");
    exit();
}

$user = $_SESSION["user"];
$folderPath = "C:/xampp/htdocs/retreat/users/$user/messages/";

// Check if the folder exists
if (!file_exists($folderPath)) {
    echo "No messages found.";
    exit();
}

// Get all the message files
$files = scandir($folderPath);

// Remove "." and ".." from the files list
$files = array_diff($files, array('.', '..'));

if (count($files) == 0) {
    echo "No messages yet.";
    exit();
}

echo "<h2>Your Messages:</h2>";

foreach ($files as $file) {
    $message = file_get_contents($folderPath . $file);
    echo "<div><strong>Message File:</strong> $file <br><strong>Content:</strong><p>$message</p></div>";
}
?>
