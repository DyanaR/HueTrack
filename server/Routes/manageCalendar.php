<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $habit_id = $_GET['habit_id'] ?? null;
        if ($habit_id) {
            try {
                $sql = "SELECT * FROM Calendar WHERE habit_id = :habit_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':habit_id', $habit_id, PDO::PARAM_INT);
                $stmt->execute();
                $calendarEntries = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['status' => 1, 'data' => $calendarEntries]);
            } catch (PDOException $e) {
                echo json_encode(['status' => 0, 'message' => 'Error fetching calendar entries', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'habit_id is required']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->habit_id, $data->day_date, $data->label_id, $data->label_name, $data->label_color)) {
            try {
                $sql = "INSERT INTO calendar (calendar_id, habit_id, day_date, label_id, label_name, label_color) 
                            VALUES (:calendar_id, :habit_id, :day_date, :label_id, :label_name, :label_color)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':calendar_id', $data->calendar_id);
                $stmt->bindParam(':habit_id', $data->habit_id); // ensure habit_id is valid here
                $stmt->bindParam(':day_date', $data->day_date);
                $stmt->bindParam(':label_id', $data->label_id);
                $stmt->bindParam(':label_name', $data->label_name);
                $stmt->bindParam(':label_color', $data->label_color);
                $stmt->execute();
                echo json_encode(['status' => 1, 'message' => 'Calendar entry added successfully']);
            } catch (PDOException $e) {
                echo json_encode(['status' => 0, 'message' => 'Failed to add calendar entry', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'All fields are required']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->calendar_id, $data->label_id, $data->label_name, $data->label_color)) {
            try {
                $sql = "UPDATE Calendar SET label_id = :label_id, label_name = :label_name, label_color = :label_color 
                        WHERE calendar_id = :calendar_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':calendar_id', $data->calendar_id);
                $stmt->bindParam(':label_id', $data->label_id);
                $stmt->bindParam(':label_name', $data->label_name);
                $stmt->bindParam(':label_color', $data->label_color);
                $stmt->execute();
                echo json_encode(['status' => 1, 'message' => 'Calendar entry updated successfully']);
            } catch (PDOException $e) {
                echo json_encode(['status' => 0, 'message' => 'Failed to update calendar entry', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'All fields are required for updating']);
        }
        break;

    case 'DELETE':
        $calendar_id = $_GET['calendar_id'] ?? null;
        if ($calendar_id) {
            try {
                $sql = "DELETE FROM Calendar WHERE calendar_id = :calendar_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':calendar_id', $calendar_id);
                $stmt->execute();
                echo json_encode(['status' => 1, 'message' => 'Calendar entry deleted successfully']);
            } catch (PDOException $e) {
                echo json_encode(['status' => 0, 'message' => 'Failed to delete calendar entry', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'calendar_id is required for deletion']);
        }
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method']);
        break;
}
