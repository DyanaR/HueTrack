<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'));

    $label_id = $data->label_id;
    $habit_id = $data->habit_id;
    $label_name = $data->label_name ?? null;
    $label_color = $data->label_color ?? null;

    // validate label_id and habit_id
    if (!$label_id || !$habit_id) {
        echo json_encode(['status' => 0, 'message' => 'label_id and habit_id are required.']);
        exit;
    }

    // validate and sanitize label_name
    if ($label_name !== null) {
        // remove leading/trailing spaces and normalize spaces between words
        $label_name = preg_replace('/\s+/', ' ', trim($label_name));

        // check length constraint for label_name
        if (strlen($label_name) > 50) {
            echo json_encode(['status' => 0, 'message' => 'label_name exceeds 50 characters.']);
            exit;
        }

        // ensure label_name is not empty after normalization
        if (strlen($label_name) === 0) {
            echo json_encode(['status' => 0, 'message' => 'label_name cannot be empty.']);
            exit;
        }
    }

    // validate and sanitize label_color
    if ($label_color !== null) {
        $label_color = trim($label_color); // remove unnecessary whitespace
        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $label_color)) {
            echo json_encode(['status' => 0, 'message' => 'Invalid label_color format.']);
            exit;
        }
    }

    try {
        $conn->beginTransaction();

        // update the label table
        // we use COALESCE to make sure if we didnt intend to update label_name or label_color they are left unchanged instead of becoming NULL
        $sql1 = "UPDATE labels 
                SET label_name = COALESCE(:label_name, label_name), 
                    label_color = COALESCE(:label_color, label_color) 
                WHERE label_id = :label_id AND habit_id = :habit_id";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(':label_name', $label_name);
        $stmt1->bindParam(':label_color', $label_color);
        $stmt1->bindParam(':label_id', $label_id);
        $stmt1->bindParam(':habit_id', $habit_id);

        if (!$stmt1->execute()) {
            $conn->rollBack();
            echo json_encode(['status' => 0, 'message' => 'Failed to update label.']);
            exit;
        }


        // check if calendar data exists for that label first
        $checkCalendarSQL = "SELECT COUNT(*) FROM calendar WHERE label_id = :label_id";
        $checkStmt = $conn->prepare($checkCalendarSQL);
        $checkStmt->bindParam(':label_id', $label_id);
        $checkStmt->execute();
        $calendarExists = $checkStmt->fetchColumn() > 0;


        // if calendar data exists, update calendar table
        if ($calendarExists) {
            $sql2 = "UPDATE calendar 
                    SET label_name = COALESCE(:label_name, label_name), 
                        label_color = COALESCE(:label_color, label_color) 
                    WHERE label_id = :label_id";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->bindParam(':label_name', $label_name);
            $stmt2->bindParam(':label_color', $label_color);
            $stmt2->bindParam(':label_id', $label_id);

            if (!$stmt2->execute()) {
                $conn->rollBack();
                echo json_encode(['status' => 0, 'message' => 'Failed to update calendar.']);
                exit;
            }
        }

        $conn->commit();
        echo json_encode(['status' => 1, 'message' => 'Label updated successfully.']);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(['status' => 0, 'message' => 'Error occurred: ' . $e->getMessage()]);
    }
}
