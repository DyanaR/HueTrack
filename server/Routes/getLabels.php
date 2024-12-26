<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET' && isset($_GET['habit_id'])) {
    $habit_id = $_GET['habit_id'];

    try {
        $sql = "SELECT * FROM labels WHERE habit_id = :habit_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':habit_id', $habit_id, PDO::PARAM_INT);
        $stmt->execute();
        $labels = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($labels) {
            echo json_encode(['status' => 1, 'data' => $labels]);
        } else {
            echo json_encode(['status' => 0, 'message' => 'No labels found for the given habit_id']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 0, 'message' => 'Error retrieving labels', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid request or missing habit_id']);
}
