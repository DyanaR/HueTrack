<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // handle CORS preflight request
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // check if label_id is provided
    if (!isset($_GET['label_id'])) {
        echo json_encode(['status' => 0, 'message' => 'label_id is required.']);
        exit;
    }

    // validate UUID Format and sanitize 
    $label_id = trim($_GET['label_id']); // remove any extra spaces
    if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i', $label_id)) {
        echo json_encode(['status' => 0, 'message' => 'Invalid label_id format.']);
        exit;
    }

    try {
        $conn->beginTransaction();

        // delete from calendar table
        $sql1 = "DELETE FROM calendar WHERE label_id =:label_id";
        $stmt1 = $conn->prepare($sql1);
        // binding parameters protects from SQL injection
        $stmt1->bindParam(':label_id', $label_id);

        //delete from label table
        $sql2 = "DELETE FROM labels WHERE label_id = :label_id";
        $stmt2 = $conn->prepare($sql2);
        // binding parameters protects from SQL injection
        $stmt2->bindParam(':label_id', $label_id);



        // execute both queries
        if ($stmt1->execute() && $stmt2->execute()) {
            $conn->commit();
            $response = ['status' => 1, 'message' => 'Label deleted successfully.'];
        } else {
            $conn->rollBack();
            $response = ['status' => 0, 'message' => 'Failed to delete label.'];
        }
    } catch (Exception $e) {
        $conn->rollBack();
        $response = ['status' => 0, 'message' => 'Error occurred: ' . $e->getMessage()];
    }

    echo json_encode($response);
}
