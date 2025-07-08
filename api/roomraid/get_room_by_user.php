<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

// รับค่า user_id จากพารามิเตอร์
$created_by = isset($_GET['created_by']) ? $_GET['created_by'] : null;

if (!$created_by) {
    echo json_encode([
        "status" => 'error',
        "message" => "Missing 'created_by' parameter."
    ]);
    exit;
}

try {
    // เตรียมคำสั่ง SQL แบบปลอดภัย
    $stmt = $pdo->prepare(
    "SELECT 
    b.*, u.trainer_name AS created_by_name,
    (SELECT COUNT(*) FROM user_raid_rooms urr WHERE urr.raid_rooms_id = b.id) AS participants
    FROM 
        raid_rooms b
    JOIN 
        users u ON b.created_by = u.id
    WHERE 
        b.created_by = :created_by
        AND STR_TO_DATE(CONCAT(CURDATE(), ' ', b.time_slot), '%Y-%m-%d %H:%i') >= NOW()
    ORDER BY
        b.id DESC"
        );
    $stmt->bindParam(':created_by', $created_by);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => 'success',
        "count" => count($data),
        "myraid" => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => 'error',
        "message" => 'ไม่สามารถดึงข้อมูลได้: ' . $e->getMessage()
    ]);
}
