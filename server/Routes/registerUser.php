<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "POST":
        // get the input JSON data
        $user = json_decode(file_get_contents('php://input'));

        // prepare the SQL query to insert the new user
        $sql = "INSERT INTO users (uid, email, username, created_at) VALUES (:uid, :email, :username, :created_at)";
        $stmt = $conn->prepare($sql);

        // bind parameters
        $stmt->bindParam(':uid', $user->uid);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':username', $user->username);
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
