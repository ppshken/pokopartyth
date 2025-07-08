<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php'; // ปรับ path ให้ตรงกับโครงสร้างจริง

// รับค่า user_id ที่ไม่ต้องการให้แสดงห้องที่ตัวเองสร้าง
$created_by = isset($_GET['created_by']) ? $_GET['created_by'] : null;

try {
    if ($created_by) {
        // ถ้ามีการส่ง created_by มา
        $stmt = $pdo->prepare("
        SELECT 
            r.*, 
            u.trainer_name AS creator_name, 
            (
            SELECT COUNT(*) 
            FROM user_raid_rooms urr 
            WHERE urr.raid_rooms_id = r.id
            ) AS participants
        FROM 
            raid_rooms r 
        LEFT JOIN 
            users u ON r.created_by = u.id 
        WHERE 
            r.created_by <> :created_by
            AND STR_TO_DATE(CONCAT(CURDATE(), ' ', r.time_slot), '%Y-%m-%d %H:%i') >= NOW()
        HAVING 
            participants < r.people_count
        ORDER BY 
            r.id DESC
        ");
        $stmt->bindParam(':created_by', $created_by, PDO::PARAM_INT);
    } else {
        // ถ้าไม่ส่ง created_by มา แสดงทุกห้อง
        $stmt = $pdo->prepare('
            SELECT 
                r.*, 
                u.trainer_name AS creator_name,
                (SELECT COUNT(*) FROM user_raid_rooms urr WHERE urr.raid_rooms_id = r.id) AS participants 
            FROM 
                raid_rooms r 
            LEFT JOIN 
                users u ON r.created_by = u.id 
            ORDER BY 
                r.id DESC
        ');
    }

    $stmt->execute();
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count' => count($rooms),
        'rooms' => $rooms
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
    ]);
}
