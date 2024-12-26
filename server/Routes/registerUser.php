<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "OPTIONS") {
    // Handle preflight requests
    http_response_code(204); // No content
    exit;
}

switch ($method) {
    case "POST":
        // get the input JSON data
        $user = json_decode(file_get_contents('php://input'));

        // validation and sanitization
        $uid = $user->uid ?? null;
        $fname = $user->fname ?? null;
        $lname = $user->lname ?? null;
        $username = $user->username ?? null;
        $email = $user->email ?? null;

        // validate first name
        if (empty($fname) || strlen($fname) > 30) {
            echo json_encode(['status' => 0, 'message' => 'Invalid fname. It must be between 1 and 30 characters.']);
            exit;
        }
        $fname = htmlspecialchars(trim($fname)); // sanitize

        // validate last name
        if (empty($lname) || strlen($lname) > 30) {
            echo json_encode(['status' => 0, 'message' => 'Invalid lname. It must be between 1 and 30 characters.']);
            exit;
        }
        $lname = htmlspecialchars(trim($lname)); // sanitize

        // validate username
        if (empty($username) || strlen($username) > 50) {
            echo json_encode(['status' => 0, 'message' => 'Invalid username. It must be between 1 and 50 characters.']);
            exit;
        }
        $username = htmlspecialchars(trim($username)); // sanitize

        // validate email
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
            echo json_encode(['status' => 0, 'message' => 'Invalid email. It must be a valid email address and under 100 characters.']);
            exit;
        }
        $email = htmlspecialchars(trim($email)); // sanitize


        // prepare the SQL query to insert the new user
        $sql = "INSERT INTO users (uid, fname, lname, email, username, created_at) VALUES (:uid, :fname, :lname, :email, :username, :created_at)";
        $stmt = $conn->prepare($sql);

        // bind parameters
        $stmt->bindParam(':uid', $uid);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':fname', $fname);
        $stmt->bindParam(':lname', $lname);
        $created_at = date("Y-m-d"); // Use current date
        $stmt->bindParam(':created_at', $created_at);

        // execute the statement and handle the response
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'User registered successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to register user. ' . $stmt->errorInfo()[2]]; // include error details
        }

        // return the response as JSON
        echo json_encode($response);
        break;

    default:
        // handle unsupported request methods
        http_response_code(405);
        echo json_encode(['status' => 0, 'message' => 'Method Not Allowed']);
        break;
}
