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
    // handle preflight requests
    http_response_code(204); // no content
    exit;
}

function validateUsername($username)
{
    // check if username is empty
    if (empty($username)) {
        return 'Username is required.';
    }

    // regex for username validation
    $regex = '/^[a-zA-Z](?!.*__)[a-zA-Z0-9_]{2,28}[a-zA-Z0-9]$/';

    // validate against regex
    if (!preg_match($regex, $username)) {
        return 'Invalid username. It must:
        - Start with a letter.
        - Be 4-30 characters long.
        - Contain only letters, digits, or a single underscore between characters.
        - Not start or end with an underscore.
        - No whitespace.';
    }

    // ensure the username length is within the limit
    if (strlen($username) > 30) {
        return 'Invalid username. It must be 30 characters or less.';
    }

    return null; // validation passed
}

switch ($method) {
    case "POST":
        // get the input JSON data
        $user = json_decode(file_get_contents('php://input'));

        // validation and sanitization
        $uid = $user->uid ?? null;
        $username = $user->username ?? null;
        $email = $user->email ?? null;

        // validate username
        $usernameError = validateUsername($username);

        if ($usernameError) {
            echo json_encode(['status' => 0, 'message' => $usernameError]);
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
        $sql = "INSERT INTO users (uid, email, username, created_at) VALUES (:uid, :email, :username, :created_at)";
        $stmt = $conn->prepare($sql);

        // bind parameters
        $stmt->bindParam(':uid', $uid);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':username', $username);

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
