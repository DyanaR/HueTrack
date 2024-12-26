<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No content
    exit; // Stop further execution
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'DbConnect.php'; // Include your database connection file
$objDb = new DbConnect;
$conn = $objDb->connect();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // get the input JSON data
    $input = json_decode(file_get_contents('php://input'));

    // check if the input is valid
    if (empty($input->username)) {
        echo json_encode(['status' => 0, 'message' => 'Username is required.']);
        exit;
    }

    // prepare the SQL query to check if the username exists
    $sql = "SELECT COUNT(*) FROM users WHERE username = :username";
    $stmt = $conn->prepare($sql);

    // bind the username parameter
    $stmt->bindParam(':username', $input->username);

    // execute and check for errors
    if (!$stmt->execute()) {
        echo json_encode(['status' => 0, 'message' => 'Database query error.']);
        exit;
    }

    // fetch the count of matching usernames
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        // username exists
        $response = ['status' => 0, 'message' => 'Username already exists.'];
    } else {
        // username is available
        $response = ['status' => 1, 'message' => 'Username is available.'];
    }

    // return the response as JSON
    echo json_encode($response);
} else {
    // handle unsupported request methods
    http_response_code(405);
    echo json_encode(['status' => 0, 'message' => 'Method Not Allowed']);
}
