<?php
session_start(); // Start the session

// Database connection
$servername = "localhost";
$db_username = "root";
$db_password = "";
$db_name = "mydatabase";

$conn = new mysqli($servername, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the user is logged in
if (!isset($_SESSION['user'])) {
    die("You must be logged in to update your data.");
}

// Get the logged-in username
$logged_in_user = $_SESSION['user'];

$message = ""; // Store status message

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_value = $_POST['new_value']; // New value for the accent color

    // Input validation: Must be exactly 6 ASCII characters
    if (preg_match('/^[\x20-\x7E]{6}$/', $new_value)) {
        // Prepare the SQL statement
        $stmt = $conn->prepare("UPDATE users SET accentcolour = ? WHERE username = ?");
        $stmt->bind_param("ss", $new_value, $logged_in_user);

        // Execute the statement
        if ($stmt->execute()) {
            $message = "Accent color updated successfully!";
        } else {
            $message = "Error updating record: " . $stmt->error;
        }

        $stmt->close();
    } else {
        $message = "Invalid input! Must be exactly 6 ASCII characters.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Accent Colour</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s, color 0.3s;
        }

        body {
            background-color: #f4f4f4;
            color: #2e2e2e;
        }

        .container {
            width: 50vw;
            height: auto;
            max-width: 500px;
            min-width: 300px;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        button {
            padding: 1vw 2vw;
            border: none;
            background-color: #007bff;
            color: #ffffff;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #0056b3;
        }

        .message {
            margin-top: 15px;
            font-size: 14px;
            font-weight: bold;
            color: green;
        }

        /* Dark Mode Styles */
        body.dark-mode {
            background-color: #181818;
            color: #f4f4f4;
        }

        body.dark-mode .container {
            background-color: #242424;
            box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
        }

        body.dark-mode input {
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
        }

        body.dark-mode button {
            background-color: #555;
            color: #fff;
            border: 1px solid #777;
        }

        body.dark-mode button:hover {
            background-color: #777;
        }

        /* Toggle Button */
        #mode-toggle {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        #mode-toggle:hover {
            background-color: #0056b3;
        }
		
		#home {
			position: absolute;
			top: 10px;
			right: 10px;
		}
		
    </style>
</head>
<body>
    <button id="mode-toggle">Toggle Dark Mode</button>
	<button id="home" onclick="home()">Home</button>
	
    <div class="container">
        <h1>Update Accent Colour</h1>
        <form method="POST">
            <input type="text" name="new_value" maxlength="6" placeholder="Enter Hex Code (No #)" required>
            <button type="submit">Update</button>
        </form>
        <div class="message"><?= $message; ?></div>
    </div>

    <script>
        const modeToggle = document.getElementById("mode-toggle");
        modeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
        });

        // Load saved dark mode preference
        if (localStorage.getItem("dark-mode") === "true") {
            document.body.classList.add("dark-mode");
        }
		
		function home() {
			window.location.href = 'home.php';
		}
    </script>
</body>
</html>
