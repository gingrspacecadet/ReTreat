<?php
// Database connection
$servername = "localhost";
$db_username = "root";
$db_password = "";
$db_name = "mydatabase"; // Adjust with your database name

$conn = new mysqli($servername, $db_username, $db_password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle login/signup logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // SQL query to check if the username exists
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Verify the password using password_hash() and password_verify()
        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['user'] = $username;
            header("Location: home.php"); // Redirect to the home page
            exit();
        } else {
            $error = "Invalid password";
        }
    } else {
        // If username doesn't exist, sign up the user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $insert_sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("ss", $username, $hashed_password);
        if ($insert_stmt->execute()) {
            session_start();
            $_SESSION['user'] = $username;
            header("Location: home.php"); // Redirect to the home page after sign-up
            exit();
        } else {
            $error = "Error signing up user.";
        }
    }
}

// Close the database connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <title>Login / Sign Up</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
        }
        form {
            width: 300px;
            margin: 100px auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        input {
            width: 92%;
            padding: 10px;
            margin: 10px 0;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
    <script>
        // Function to check username in real-time
        function checkUsername() {
            const username = document.getElementById('username').value;

            if (username === "") {
                document.getElementById('status').textContent = "";
                return;
            }

            // Send an AJAX request to check if the username exists
            fetch(`<?php echo $_SERVER['PHP_SELF']; ?>?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    // If the username exists, set to Login, else Sign Up
                    if (data.exists) {
                        document.getElementById('status').textContent = "Login";
                    } else {
                        document.getElementById('status').textContent = "Sign Up";
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    </script>
</head>
<body>
    <form method="POST">
        <h2 id="status">Login</h2>
        <input type="text" id="username" name="username" placeholder="Enter Username" oninput="checkUsername()" required>
        <input type="password" id="password" name="password" placeholder="Enter Password" required>
        <button type="submit">Submit</button>
    </form>
    
    <?php if (isset($error)): ?>
        <p style="color: red;"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
</body>
</html>
