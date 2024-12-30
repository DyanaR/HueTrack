<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // allow requests from your frontend
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

//handle preflight request 
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (empty($input['email'])) {
        http_response_code(400);
        echo json_encode(['status' => 0, 'message' => 'Email is required.']);
        exit;
    }

    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);

    try {
        $sql = "SELECT 1 FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);

        if (!$stmt->execute()) {
            throw new Exception('Database query error.');
        }

        $exists = $stmt->fetchColumn() ? true : false;
        echo json_encode(['status' => 1, 'exists' => $exists]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 0, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 0, 'message' => 'Method Not Allowed']);
}
