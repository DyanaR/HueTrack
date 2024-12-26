<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'DbConnect.php';

try {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    $uid = $_GET['uid'] ?? null;

    if (!$uid) {
        echo json_encode(['status' => 0, 'message' => 'UID is required']);
        exit;
    }

    $sql = "SELECT fname, lname, username FROM users WHERE uid = :uid";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':uid', $uid, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['status' => 1, 'data' => $user]);
    } else {
        echo json_encode(['status' => 0, 'message' => 'User not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 0, 'message' => 'Database error: ' . $e->getMessage()]);
}
