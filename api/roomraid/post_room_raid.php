<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

// รับข้อมูล JSON
$data = json_decode(file_get_contents('php://input'), true);


// ตรวจสอบข้อมูลที่จำเป็น
if (!isset($data['boss_id'], $data['boss_name'], $data['boss_img'], $data['boss_tier'], $data['created_by'], $data['time_slot'], $data['people_count'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ข้อมูลไม่ครบถ้วน'
    ]);
    exit;
}

$boss_id = $data['boss_id'];
$boss_name = $data['boss_name'];
$boss_img = $data['boss_img'];
$boss_tier = $data['boss_tier'];
$created_by = $data['created_by'];
$time_slot = $data['time_slot'];
$status = 'open';
$people_count = intval($data['people_count']);
$created_at = date('Y-m-d H:i:s');

try {
    $stmt = $pdo->prepare('INSERT INTO raid_rooms (boss_id, boss_name, boss_img, boss_tier, created_by, time_slot, status, people_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$boss_id, $boss_name, $boss_img, $boss_tier, $created_by, $time_slot, $status, $people_count, $created_at]);
    echo json_encode([
        'success' => true,
        'message' => 'สร้างห้องบอสสำเร็จ'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
    ]);
}
