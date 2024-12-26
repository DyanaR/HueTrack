<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // handle inserting default habit when the user is created
    $data = json_decode(file_get_contents('php://input'));

    $habit_id = $data->habit_id;
    $habit_name = $data->habit_name;
    $uid = $data->uid; // Firebase UID

    // insert habit with habit_name and uid
    $sql = "INSERT INTO habits (habit_id, uid, habit_name, created_at) VALUES (:habit_id, :uid, :habit_name, :created_at)";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':habit_id', $habit_id);
    $stmt->bindParam(':uid', $uid);
    $stmt->bindParam(':habit_name', $habit_name);
    $created_at = date("Y-m-d");
    $stmt->bindParam(':created_at', $created_at);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Habit added successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to add habit.'];
    }

    echo json_encode($response);
}

// handle updating existing habit
if ($method === 'PUT') {
    // retrieve the incoming data
    $data = json_decode(file_get_contents('php://input'));

    $habit_name = $data->habit_name;
    $uid = $data->uid;

    // update the existing habit for this user
    $sql = "UPDATE habits SET habit_name = :habit_name WHERE uid = :uid";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':habit_name', $habit_name);
    $stmt->bindParam(':uid', $uid);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Habit updated successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to update habit.'];
    }

    echo json_encode($response);
}
