<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

$user_id = $_GET['user_id'] ?? null;
$raid_rooms_id = $_GET['raid_rooms_id'] ?? null;

if ($user_id && $raid_rooms_id) {
    try {
        $stmt = $pdo->prepare('
            UPDATE user_raid_rooms SET status="true" WHERE user_id=:user_id AND raid_rooms_id= :raid_rooms_id;
        ');
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':raid_rooms_id', $raid_rooms_id, PDO::PARAM_INT);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'เข้าห้องเรียบร้อย'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'ไม่พบข้อมูลห้อง'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'ไม่สามารถเข้าห้องได้'
    ]);
}
