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


function validateLabelName($label_name)
{
    if (empty($label_name)) {
        return "Label name required.";
    }

    $regex = '/^(?! )[a-zA-Z0-9+_-]+(?: [a-zA-Z0-9+_-]+)*(?! )$/';

    // check for consecutive special characters
    if (preg_match('/\+\+|--|__/', $label_name)) {
        return 'Invalid input: No consecutive "+", "-", or "_" allowed.';
    }

    if (!preg_match($regex, $label_name)) {
        return 'Invalid input. Allowed characters are alphanumeric, single spaces, "+", "-", and "_" (no consecutive special characters).';
    }

    if (strlen($label_name) > 10) {
        return 'Invalid label name. It must be 10 characters or fewer.';
    }

    return null; // validation passed
}

if ($method === 'POST') {
    // handle inserting default labels when the user is created
    $data = json_decode(file_get_contents('php://input'));


    $habit_id = $data->habit_id ?? null; // get habit_id from the request
    $labels = $data->labels ?? [];     // array of default labels with names and colors

    if (empty($habit_id)) {
        echo json_encode(['status' => 0, 'message' => 'Habit ID is required.']);
        exit;
    }

    if (!is_array($labels) || empty($labels)) {
        echo json_encode(['status' => 0, 'message' => 'Labels must be a non-empty array.']);
        exit;
    }

    $successCount = 0;
    $failureCount = 0;

    foreach ($labels as $label) {
        $label_id = $label->label_id; // UUID for each label
        $label_name = $label->label_name;
        $label_color = $label->label_color;

        $labelNameError = validateLabelName($label_name);

        if ($labelNameError) {
            echo json_encode(['status' => 0, 'message' => $labelNameError]);
            exit;
        }

        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $label_color)) {
            echo json_encode(['status' => 0, 'message' => 'Invalid label color. Use HEX format (e.g., #FFFFFF).']);
            exit;
        }

        // insert label into the labels table
        $sql = "INSERT INTO labels (label_id, habit_id, label_name, label_color, created_at) 
                VALUES (:label_id, :habit_id, :label_name, :label_color, :created_at)";
        $stmt = $conn->prepare($sql);

        $created_at = date("Y-m-d");

        $stmt->bindParam(':label_id', $label_id);
        $stmt->bindParam(':habit_id', $habit_id);
        $stmt->bindParam(':label_name', $label_name);
        $stmt->bindParam(':label_color', $label_color);
        $stmt->bindParam(':created_at', $created_at);

        if ($stmt->execute()) {
            $successCount++;
        } else {
            $failureCount++;
        }
    }

    echo json_encode([
        'status' => $failureCount === 0 ? 1 : 0,
        'message' => $failureCount === 0 ? 'Labels added successfully.' : "Failed to add $failureCount labels.",
        'successCount' => $successCount,
        'failureCount' => $failureCount,
    ]);
}
