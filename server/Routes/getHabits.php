<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && isset($_GET['uid'])) {
    $uid = $_GET['uid']; // get the Firebase UID from the request

    // fetch habits for the user with this UID
    $sql = "SELECT * FROM habits WHERE uid = :uid";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':uid', $uid);
    $stmt->execute();
    $habits = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($habits); // return all habits for the user
}
