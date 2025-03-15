<?php
session_start();

$conn = new mysqli("localhost", "root", "", "mydatabase");

if ($conn->connect_error) {
    die(json_encode([]));
}

$offset = isset($_GET["offset"]) ? (int)$_GET["offset"] : 0;
$limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 10;

$sql = "SELECT p.content, u.username, p.created_at FROM posts p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.id DESC 
        LIMIT ?, ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $offset, $limit);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = [
        "username" => $row["username"] . " (" . $row["created_at"] . ")",
        "content" => $row["content"]
    ];
}

$stmt->close();
$conn->close();

echo json_encode($posts);
?>