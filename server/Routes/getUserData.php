// getUserData.php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$uid = $_GET['uid'] ?? null;

if ($uid) {
    $sql = "SELECT username FROM users WHERE uid = :uid";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':uid', $uid);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['status' => 1, 'data' => $user]);
    } else {
        echo json_encode(['status' => 0, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['status' => 0, 'message' => 'UID is required']);
}
